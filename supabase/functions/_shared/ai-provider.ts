/**
 * Provider-agnostic AI service.
 *
 * All providers expose the same `complete()` contract so callers never depend on a
 * specific vendor. Lovable AI (the default) needs no user key; OpenAI, Gemini and
 * Anthropic activate automatically when their API key secret is present.
 */

export type ProviderName = "lovable" | "openai" | "gemini" | "anthropic";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompleteOptions {
  messages: AIMessage[];
  system?: string;
  model?: string;
  temperature?: number;
  stream?: boolean;
}

export interface AIProvider {
  name: ProviderName;
  available: boolean;
  defaultModel: string;
  complete(opts: CompleteOptions): Promise<Response>;
}

const env = (k: string) => Deno.env.get(k) ?? "";

/** OpenAI-compatible transport — used by Lovable AI Gateway and OpenAI itself. */
function openAICompatible(
  name: ProviderName,
  baseUrl: string,
  apiKey: string,
  defaultModel: string,
  authHeader: Record<string, string>,
): AIProvider {
  return {
    name,
    available: !!apiKey,
    defaultModel,
    async complete({ messages, system, model, temperature, stream }: CompleteOptions) {
      return fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          model: model || defaultModel,
          messages: system ? [{ role: "system", content: system }, ...messages] : messages,
          ...(temperature !== undefined ? { temperature } : {}),
          stream: !!stream,
        }),
      });
    },
  };
}

function geminiProvider(): AIProvider {
  const key = env("GEMINI_API_KEY");
  return {
    name: "gemini",
    available: !!key,
    defaultModel: "gemini-2.5-flash",
    async complete({ messages, system, model }: CompleteOptions) {
      const m = model || "gemini-2.5-flash";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
            contents: messages.map((msg) => ({
              role: msg.role === "assistant" ? "model" : "user",
              parts: [{ text: msg.content }],
            })),
          }),
        },
      );
      if (!res.ok) return res;
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
      return Response.json({ choices: [{ message: { role: "assistant", content: text } }] });
    },
  };
}

function anthropicProvider(): AIProvider {
  const key = env("ANTHROPIC_API_KEY");
  return {
    name: "anthropic",
    available: !!key,
    defaultModel: "claude-sonnet-4-20250514",
    async complete({ messages, system, model }: CompleteOptions) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-20250514",
          max_tokens: 4096,
          ...(system ? { system } : {}),
          messages: messages.filter((m) => m.role !== "system"),
        }),
      });
      if (!res.ok) return res;
      const data = await res.json();
      const text = (data?.content ?? []).map((c: any) => c.text ?? "").join("");
      return Response.json({ choices: [{ message: { role: "assistant", content: text } }] });
    },
  };
}

export function getProvider(preferred?: string): AIProvider {
  const providers: Record<ProviderName, AIProvider> = {
    lovable: openAICompatible(
      "lovable",
      "https://ai.gateway.lovable.dev/v1",
      env("LOVABLE_API_KEY"),
      "google/gemini-3.6-flash",
      { Authorization: `Bearer ${env("LOVABLE_API_KEY")}` },
    ),
    openai: openAICompatible(
      "openai",
      "https://api.openai.com/v1",
      env("OPENAI_API_KEY"),
      "gpt-5-mini",
      { Authorization: `Bearer ${env("OPENAI_API_KEY")}` },
    ),
    gemini: geminiProvider(),
    anthropic: anthropicProvider(),
  };

  const wanted = (preferred ?? env("AI_PROVIDER") ?? "lovable") as ProviderName;
  const chosen = providers[wanted];
  if (chosen?.available) return chosen;
  // Deterministic fallback order.
  for (const name of ["lovable", "openai", "gemini", "anthropic"] as ProviderName[]) {
    if (providers[name].available) return providers[name];
  }
  throw new Error("No AI provider is configured");
}

export function listProviders() {
  return (["lovable", "openai", "gemini", "anthropic"] as ProviderName[]).map((name) => {
    try {
      const p = getProvider(name);
      return { name, available: p.name === name };
    } catch {
      return { name, available: false };
    }
  });
}