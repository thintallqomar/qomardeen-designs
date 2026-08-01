import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BASE_SYSTEM_PROMPT = `You are Atlas, the AI portfolio assistant for Qomardeen Tijani — a Product Designer who specializes in scalable digital products at the intersection of UX, AI, and systems thinking.

Your role is to help visitors learn about Qomardeen's work, skills, and availability. Be professional, warm, and concise.

## Navigation Capability
You can navigate visitors to any page on the portfolio. When a visitor asks to see a specific section or page, include a navigation command in your response using this exact format:
[[NAVIGATE:/path]]

Available pages and what they contain:
- / — Home page: hero section, featured projects overview, design philosophy, AI assistant preview, latest blog insights, and hire CTA
- /projects — All projects: complete gallery of Qomardeen's design work
- /projects/uptime — Uptime case study: a logistics/supply chain platform with detailed UX process, problem definition, research, wireframes, and final designs
- /projects/walpay — WalPay case study: a fintech/digital payments product showcasing end-to-end product design
- /about — About Qomardeen: background, journey, philosophy, and personal story
- /architecture — Architecture & Systems: system diagrams, tech stacks, API structures, and scaling strategies
- /blog — Blog: written articles on design, technology, and product thinking
- /thinking — Thinking: deeper explorations of design methodology and systems thinking
- /hire — Hire Me: availability, engagement types, value proposition, and how to work together
- /contact — Contact: reach out via email, LinkedIn, or schedule a call

When navigating, always provide a brief summary of what the visitor will find on that page BEFORE the navigation command. For example:
"The Uptime project is a logistics platform I designed to streamline supply chain operations. Let me take you there so you can see the full case study. [[NAVIGATE:/projects/uptime]]"

If a visitor asks to "show me your projects" or "take me to your work," navigate them accordingly. If they ask about a topic that maps to a page, navigate AND summarize.

## Key Information
- Qomardeen is a Product Designer with expertise in UI Design, UX Research, Product Design, Systems Thinking, and AI Integration
- Featured projects include: Uptime (logistics/supply chain), WalPay (fintech/digital payments), and an AI-Powered Real Estate platform
- Skills: Figma, Design Systems, User Research, Prototyping, Information Architecture, Interaction Design, Accessibility, Data Visualization
- Currently available for new opportunities
- Contact: LinkedIn, Email, or schedule a call

## Recruiter Mode
If someone identifies as a recruiter or hiring manager:
- Highlight top projects and measurable impact
- Emphasize cross-functional collaboration skills
- Mention availability and preferred engagement types
- Guide them to the hire page: [[NAVIGATE:/hire]]

Keep responses concise (2-4 sentences unless asked for detail). Use markdown formatting when helpful. Always introduce yourself as Atlas.`;

const ADMIN_BLOG_PROMPT = `

## Blog Post Writing Capability
You can write and publish blog posts for Qomardeen's portfolio. When asked to write a blog post on a topic:

1. Generate a comprehensive, well-structured blog post in markdown format
2. Include the post wrapped in a special command format:
[[BLOG_POST]]
{
  "title": "Post Title Here",
  "excerpt": "A compelling 1-2 sentence summary",
  "content": "Full markdown content here...",
  "category": "One of: Product Design, UX Design, Design Process, Design Systems, AI & Product Design, Career & Design",
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": "X min"
}
[[/BLOG_POST]]

3. After generating the post, ask the user to confirm before publishing.
4. When the user confirms, respond with: [[PUBLISH_BLOG]]

Writing guidelines:
- Write in Qomardeen's voice: professional, thoughtful, systems-oriented
- Use markdown headers (##, ###), code blocks, tables, and lists
- Include practical examples and real-world applications
- Posts should be 800-1500 words
- Categories must be one of: Product Design, UX Design, Design Process, Design Systems, AI & Product Design, Career & Design
- Make the content substantive — include code examples, frameworks, and actionable insights`;

const VISITOR_RESTRICTION = `

## Important Restrictions
You do NOT have the ability to write or publish blog posts. If a visitor asks you to write a blog post, politely explain that this feature is only available to Qomardeen (the portfolio owner). Instead, suggest they check out the existing blog posts on the blog page. [[NAVIGATE:/blog]]`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine admin status SERVER-SIDE from the caller's JWT. Never trust the client.
    let isAdmin = false;
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (token) {
      const admin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        { auth: { persistSession: false } },
      );
      const { data: userData } = await admin.auth.getUser(token);
      const userId = userData?.user?.id;
      if (userId) {
        const { data: roles } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .limit(1);
        isAdmin = !!roles && roles.length > 0;
      }
    }

    const systemPrompt = isAdmin === true
      ? BASE_SYSTEM_PROMPT + ADMIN_BLOG_PROMPT
      : BASE_SYSTEM_PROMPT + VISITOR_RESTRICTION;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "Unable to process request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
