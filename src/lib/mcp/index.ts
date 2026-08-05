import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listContent from "./tools/list-content";
import getContent from "./tools/get-content";
import searchContent from "./tools/search-content";
import createDraft from "./tools/create-draft";
import updateDraft from "./tools/update-draft";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "qomardeentijani",
  title: "qomardeentijani",
  version: "0.1.0",
  instructions:
    "Tools for Qomardeen Tijani's portfolio and knowledge hub. Read, search, draft and update content items (articles, thinking pieces, architecture write-ups and resources). All access runs as the signed-in user under row-level security.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listContent, getContent, searchContent, createDraft, updateDraft],
});