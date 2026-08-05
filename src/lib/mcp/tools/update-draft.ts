import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_draft",
  title: "Update content item",
  description:
    "Update fields on an existing content item. Row-level security decides whether the signed-in user may edit it or change its status.",
  inputSchema: {
    id: z.string().uuid().describe("ID of the content item to update."),
    title: z.string().trim().min(3).optional().describe("New title."),
    excerpt: z.string().trim().optional().describe("New excerpt."),
    tldr: z.string().trim().optional().describe("New TL;DR summary."),
    body_markdown: z.string().optional().describe("Replacement markdown body."),
    tags: z.array(z.string().trim()).optional().describe("Replacement tag list."),
    status: z.enum(["draft", "published", "scheduled", "archived"]).optional()
      .describe("New publication status (requires publishing rights)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ id, ...fields }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const patch: Record<string, unknown> = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "No fields provided to update." }], isError: true };
    }
    if (typeof patch.body_markdown === "string") {
      const words = patch.body_markdown.trim().split(/\s+/).filter(Boolean).length;
      patch.word_count = words;
      patch.reading_time_minutes = Math.max(1, Math.round(words / 225));
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return { content: [{ type: "text", text: "No matching item, or you do not have permission to edit it." }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Updated "${data.title}".` }],
      structuredContent: { item: data },
    };
  },
});