import { createClient, corsHeaders } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@4";

const CommentSchema = z.object({
  article_slug: z.string().trim().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().trim().min(1).max(5000),
  parent_id: z.string().uuid().nullable().default(null),
  guest_name: z.string().trim().min(1).max(100).nullable().default(null),
  guest_email: z.string().trim().email().max(254).nullable().default(null),
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const parsed = CommentSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: "Invalid comment details" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const authorization = req.headers.get("Authorization") ?? "";
    let userId: string | null = null;
    if (authorization.startsWith("Bearer ")) {
      const { data, error } = await admin.auth.getUser(authorization.slice(7));
      if (error || !data.user) return json({ error: "Invalid session" }, 401);
      userId = data.user.id;
    }

    const input = parsed.data;
    if (!userId && !input.guest_name) return json({ error: "Guest name is required" }, 400);

    if (input.parent_id) {
      const { data: parent } = await admin
        .from("blog_comments")
        .select("id, article_slug")
        .eq("id", input.parent_id)
        .eq("article_slug", input.article_slug)
        .maybeSingle();
      if (!parent) return json({ error: "Invalid parent comment" }, 400);
    }

    const { data: comment, error: commentError } = await admin.from("blog_comments").insert({
      article_slug: input.article_slug,
      content: input.content,
      parent_id: input.parent_id,
      user_id: userId,
      guest_name: userId ? null : input.guest_name,
    }).select("id").single();
    if (commentError) throw commentError;

    if (!userId && input.guest_email) {
      const { error: contactError } = await admin.from("comment_contacts").insert({
        comment_id: comment.id,
        email: input.guest_email,
      });
      if (contactError) {
        await admin.from("blog_comments").delete().eq("id", comment.id);
        throw contactError;
      }
    }

    return json({ id: comment.id }, 201);
  } catch (error) {
    console.error("submit-comment failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Unable to submit comment" }, 500);
  }
});