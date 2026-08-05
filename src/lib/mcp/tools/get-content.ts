import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_content",
  title: "Get content item",
  description: "Fetch one content item with its full body (markdown/HTML) by type and slug.",
  inputSchema: {
    type: z.enum(["article", "thinking", "architecture", "resource"]).describe("Content type."),
    slug: z.string().trim().min(1).describe("URL slug of the content item."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ type, slug }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("content_items")
      .select("*")
      .eq("type", type)
      .eq("slug", slug)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No ${type} found with slug "${slug}".` }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { item: data },
    };
  },
});