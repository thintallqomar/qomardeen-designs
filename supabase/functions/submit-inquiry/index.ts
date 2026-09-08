import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();

    const name = str(body.name, 100);
    const email = str(body.email, 255);
    const projectType = str(body.projectType, 100);
    const message = str(body.message, 4000);
    const company = str(body.company, 150);
    const budget = str(body.budget, 100);
    const timeline = str(body.timeline, 100);

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !emailRe.test(email) || !projectType || !message) {
      return json({ error: "Please fill in your name, a valid email, project type and a message." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: row, error } = await admin
      .from("project_inquiries")
      .insert({
        name,
        email,
        company,
        project_type: projectType,
        budget_range: budget,
        timeline,
        message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("inquiry insert failed:", error.message);
      const rateLimited = error.message.includes("Rate limit");
      return json(
        { error: rateLimited ? "You've sent several inquiries recently. Please try again later." : "Could not save your inquiry." },
        rateLimited ? 429 : 500,
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const rows = [
        ["Name", name],
        ["Email", email],
        ["Company", company ?? "—"],
        ["Project type", projectType],
        ["Budget", budget ?? "—"],
        ["Timeline", timeline ?? "—"],
      ]
        .map(([k, v]) => `<p style="margin:4px 0"><strong>${esc(k!)}:</strong> ${esc(v!)}</p>`)
        .join("");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "onboarding@resend.dev",
          to: "qomardeentijani@gmail.com",
          reply_to: email,
          subject: `New project inquiry — ${esc(projectType)} from ${esc(name)}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px">
              <h2 style="color:#111;border-bottom:2px solid #2563eb;padding-bottom:10px">New Project Inquiry</h2>
              ${rows}
              <div style="background:#f9fafb;border-left:4px solid #2563eb;padding:16px;border-radius:4px;margin-top:16px">
                <p style="margin:0;white-space:pre-wrap">${esc(message)}</p>
              </div>
              <p style="color:#9ca3af;font-size:12px;margin-top:20px">Sent from the Hire page inquiry form. Reply directly to respond.</p>
            </div>`,
        }),
      });
      if (!res.ok) console.error("resend error:", res.status, await res.text());
    } else {
      console.error("RESEND_API_KEY not configured — inquiry saved without email notification");
    }

    return json({ success: true, id: row.id });
  } catch (e) {
    console.error("inquiry error:", e);
    return json({ error: "Unable to process your inquiry." }, 500);
  }
});
