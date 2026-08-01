import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_EVENTS = new Set([
  "auth.login.success",
  "auth.login.denied",
  "auth.logout",
  "auth.password_reset_requested",
  "content.created",
  "content.updated",
  "content.published",
  "content.unpublished",
  "content.deleted",
  "content.publish_denied",
  "media.uploaded",
  "media.deleted",
  "role.changed",
]);

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const eventType = String(body?.event_type ?? "");
    if (!ALLOWED_EVENTS.has(eventType)) {
      return new Response(JSON.stringify({ error: "unknown event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Identify the actor from the caller's JWT — never trust a client-supplied id.
    let actorId: string | null = null;
    let actorEmail: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      actorId = data.user?.id ?? null;
      actorEmail = data.user?.email ?? null;
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    await admin.from("audit_log").insert({
      event_type: eventType,
      actor_id: actorId,
      actor_email: actorEmail ?? (typeof body?.actor_email === "string" ? body.actor_email.slice(0, 254) : null),
      target_table: typeof body?.target_table === "string" ? body.target_table.slice(0, 64) : null,
      target_id: typeof body?.target_id === "string" ? body.target_id.slice(0, 128) : null,
      outcome: ["success", "denied", "error"].includes(body?.outcome) ? body.outcome : "success",
      details: typeof body?.details === "object" && body?.details !== null ? body.details : {},
      ip_hash: await hash(ip),
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("audit-log error", err);
    return new Response(JSON.stringify({ error: "failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});