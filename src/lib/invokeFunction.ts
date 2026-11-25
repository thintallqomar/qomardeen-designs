import { supabase } from '@/integrations/supabase/client';

/**
 * Calls a backend function and returns its data, or throws an Error with the function's own
 * message. supabase-js hides that message for non-2xx answers ("Edge Function returned a
 * non-2xx status code"), which left visitors with a vague "check your connection".
 */
export async function invokeFunction<T = unknown>(name: string, body: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body: body as Record<string, unknown> });
  if (error) {
    let message = '';
    const ctx = (error as { context?: unknown }).context;
    if (ctx instanceof Response) {
      try {
        const payload = await ctx.clone().json();
        message = typeof payload?.error === 'string' ? payload.error : '';
      } catch { /* not JSON */ }
      if (!message && ctx.status === 404) message = 'This feature is being updated. Please try again a little later.';
    }
    throw new Error(message || "That didn't go through. Check your connection and try again.");
  }
  const err = (data as { error?: unknown } | null)?.error;
  if (typeof err === 'string' && err) throw new Error(err);
  return data as T;
}
