import { createClient, corsHeaders } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";

const AuditSchema = z.object({
  event_type: z.enum([
    "auth.login.success", "auth.logout", "auth.password_reset_requested",
    "content.created", "content.updated", "content.published",
    "content.unpublished", "content.deleted", "content.publish_denied",
    "media.uploaded", "media.deleted", "role.changed",
  ]),
  target_table: z.string().trim().max(64).optional(),
  target_id: z.string().trim().max(128).optional(),
  outcome: z.enum(["success", "denied", "error"]).default("success"),
  details: z.record(z.string(), z.unknown()).default({}),
});

async function hash(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authorization = req.headers.get("Authorization") ?? "";
    if (!authorization.startsWith("Bearer ")) return json({ error: "Authentication required" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: userData, error: authError } = await admin.auth.getUser(authorization.slice(7));
    const user = userData.user;
    if (authError || !user) return json({ error: "Authentication required" }, 401);

    const { data: roles, error: roleError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "editor", "contributor"])
      .limit(1);
    if (roleError || !roles?.length) return json({ error: "Staff access required" }, 403);

    const parsed = AuditSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "Invalid audit event" }, 400);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { error } = await admin.from("audit_log").insert({
      ...parsed.data,
      actor_id: user.id,
      actor_email: user.email ?? null,
      ip_hash: await hash(ip),
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    });
    if (error) throw error;
    return json({ ok: true });
  } catch (error) {
    console.error("audit-log failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Unable to record audit event" }, 500);
  }
});