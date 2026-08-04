import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export interface Actor {
  id: string;
  email: string | null;
  roles: string[];
  isAdmin: boolean;
  isStaff: boolean;
}

/**
 * Verifies the caller's bearer token server-side and resolves database roles.
 * Returns null when the request has no valid session.
 */
export async function requireActor(req: Request): Promise<Actor | null> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const admin = serviceClient();
  const { data, error } = await admin.auth.getUser(token);
  const user = data?.user;
  if (error || !user) return null;
  const { data: rows } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (rows ?? []).map((r: { role: string }) => r.role);
  return {
    id: user.id,
    email: user.email ?? null,
    roles,
    isAdmin: roles.includes("admin"),
    isStaff: roles.some((r) => ["admin", "editor", "contributor"].includes(r)),
  };
}

/** Simple sliding-window throttle backed by public.auth_attempts. */
export async function rateLimit(key: string, max: number, windowSeconds: number) {
  const admin = serviceClient();
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const { count } = await admin
    .from("auth_attempts")
    .select("id", { count: "exact", head: true })
    .eq("identifier", key)
    .gte("created_at", since);
  if ((count ?? 0) >= max) return { allowed: false, remaining: 0 };
  await admin.from("auth_attempts").insert({ identifier: key, success: true });
  return { allowed: true, remaining: max - (count ?? 0) - 1 };
}