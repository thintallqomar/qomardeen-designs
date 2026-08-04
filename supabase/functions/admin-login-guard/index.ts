import { corsHeaders, serviceClient, clientIp, sha256 } from "../_shared/admin-guard.ts";

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 900; // 15 minutes

/**
 * Server-side brute-force protection for the admin sign-in form.
 * `action: "check"`  -> may this identifier/IP attempt a sign-in right now?
 * `action: "record"` -> log the outcome of an attempt.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.toLowerCase().slice(0, 254) : "";
    if (!email) return json({ error: "email required" }, 400);

    const db = serviceClient();
    const ipHash = await sha256(clientIp(req));
    const since = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();

    if (body?.action === "record") {
      await db.from("auth_attempts").insert({
        identifier: `login:${email}`,
        ip_hash: ipHash,
        success: body?.success === true,
      });
      return json({ ok: true });
    }

    const { data: rows } = await db
      .from("auth_attempts")
      .select("success, created_at")
      .eq("identifier", `login:${email}`)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(50);

    const failures: number = (rows ?? []).filter((r: { success: boolean }) => !r.success).length;

    const { count: ipFailures } = await db
      .from("auth_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("success", false)
      .gte("created_at", since);

    const locked = failures >= MAX_FAILURES || (ipFailures ?? 0) >= MAX_FAILURES * 3;
    return json({
      allowed: !locked,
      remaining: Math.max(0, MAX_FAILURES - failures),
      retryAfterSeconds: locked ? WINDOW_SECONDS : 0,
    });
  } catch (err) {
    console.error("admin-login-guard error", err);
    // Fail closed only for the check path is too risky on infra errors; allow but log.
    return json({ allowed: true, remaining: MAX_FAILURES });
  }
});