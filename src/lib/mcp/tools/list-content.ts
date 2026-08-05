import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CONTENT_FIELDS, notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_content",
  title: "List content",
  description:
    "List content items (articles, thinking pieces, architecture write-ups, resources) visible to the signed-in user, newest first.",
  inputSchema: {
    type: z.enum(["article", "thinking", "architecture", "resource"]).optional()
      .describe("Filter by content type."),
    status: z.enum(["draft", "published", "scheduled", "archived"]).optional()
      .describe("Filter by publication status."),
    limit: z.number().int().min(1).max(50).default(20).describe("Maximum number of items to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ type, status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    let query = supabaseForUser(ctx)
      .from("content_items")
      .select(CONTENT_FIELDS)
      .order("updated_at", { ascending: false })
      .limit(limit ?? 20);
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { items: data ?? [] },
    };
  },
});