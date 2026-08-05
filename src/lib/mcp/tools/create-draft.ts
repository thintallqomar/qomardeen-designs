import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export default defineTool({
  name: "create_draft",
  title: "Create draft",
  description:
    "Create a new draft content item (article, thinking piece, architecture write-up or resource). Drafts are never published automatically.",
  inputSchema: {
    type: z.enum(["article", "thinking", "architecture", "resource"]).describe("Content type."),
    title: z.string().trim().min(3).describe("Title of the new draft."),
    slug: z.string().trim().optional().describe("Optional URL slug; derived from the title when omitted."),
    excerpt: z.string().trim().optional().describe("Short summary shown in listings."),
    body_markdown: z.string().optional().describe("Body content in markdown."),
    tags: z.array(z.string().trim()).optional().describe("Tags for categorisation."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ type, title, slug, excerpt, body_markdown, tags }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const words = (body_markdown ?? "").trim().split(/\s+/).filter(Boolean).length;
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .insert({
        type,
        title,
        slug: slug?.trim() ? slugify(slug) : slugify(title),
        excerpt: excerpt ?? null,
        body_markdown: body_markdown ?? null,
        tags: tags ?? [],
        status: "draft",
        visibility: "private",
        author_id: ctx.getUserId(),
        word_count: words,
        reading_time_minutes: Math.max(1, Math.round(words / 225)),
      })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Created draft "${title}" (${data?.id}).` }],
      structuredContent: { item: data },
    };
  },
});