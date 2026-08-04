import { corsHeaders, requireActor, rateLimit, serviceClient, clientIp, sha256 } from "../_shared/admin-guard.ts";
import { getProvider, listProviders, type AIMessage } from "../_shared/ai-provider.ts";

/**
 * Admin-only AI endpoint. Every request must carry a valid session bearer token
 * belonging to a user with the `admin` role — verified server-side, never trusted
 * from the client.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const actor = await requireActor(req);
    if (!actor) return json({ error: "Authentication required" }, 401);
    if (!actor.isAdmin) return json({ error: "Administrator privileges required" }, 403);

    // Throttle: 30 admin AI calls per user per 10 minutes.
    const limit = await rateLimit(`admin-ai:${actor.id}`, 30, 600);
    if (!limit.allowed) return json({ error: "Too many AI requests. Please wait a few minutes." }, 429);

    const body = await req.json().catch(() => ({}));

    if (body?.action === "providers") {
      return json({ providers: listProviders() });
    }

    const messages: AIMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    if (!messages.length || messages.length > 50) return json({ error: "Invalid messages" }, 400);

    const provider = getProvider(typeof body?.provider === "string" ? body.provider : undefined);
    const res = await provider.complete({
      messages,
      system: typeof body?.system === "string" ? body.system.slice(0, 8000) : undefined,
      model: typeof body?.model === "string" ? body.model : undefined,
      temperature: typeof body?.temperature === "number" ? body.temperature : undefined,
      stream: body?.stream === true,
    });

    if (!res.ok) {
      if (res.status === 429) return json({ error: "AI provider rate limit reached." }, 429);
      if (res.status === 402) return json({ error: "AI credits exhausted." }, 402);
      console.error("admin-ai provider error", provider.name, res.status, await res.text());
      return json({ error: "AI provider error" }, 502);
    }

    // Audit every admin AI action.
    await serviceClient().from("audit_log").insert({
      event_type: "content.updated",
      actor_id: actor.id,
      actor_email: actor.email,
      target_table: "admin-ai",
      outcome: "success",
      details: { provider: provider.name, model: body?.model ?? provider.defaultModel },
      ip_hash: await sha256(clientIp(req)),
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    });

    if (body?.stream === true) {
      return new Response(res.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const data = await res.json();
    return json({
      provider: provider.name,
      content: data?.choices?.[0]?.message?.content ?? "",
    });
  } catch (err) {
    console.error("admin-ai error", err);
    return json({ error: "Unable to process request" }, 500);
  }
});