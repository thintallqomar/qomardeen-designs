import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CONTENT_FIELDS, notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_content",
  title: "Search content",
  description: "Search content items by keyword across title, excerpt and TL;DR summary.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Keyword or phrase to search for."),
    limit: z.number().int().min(1).max(25).default(10).describe("Maximum number of matches."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const term = query.replace(/[%,()]/g, " ").trim();
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .select(CONTENT_FIELDS)
      .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,tldr.ilike.%${term}%`)
      .order("updated_at", { ascending: false })
      .limit(limit ?? 10);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { matches: data ?? [] },
    };
  },
});