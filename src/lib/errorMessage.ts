/**
 * Turns any thrown value into a readable message for the admin.
 * Database (Supabase) errors are plain objects, not Error instances, so checking
 * `e instanceof Error` alone hid their real reason behind a generic "Upload failed".
 */
export function errorMessage(e: unknown, fallback = 'Something went wrong'): string {
  if (e instanceof Error && e.message) return e.message;
  if (e && typeof e === 'object') {
    const o = e as Record<string, unknown>;
    const parts = [o.message, o.error_description, o.error, o.details, o.hint]
      .filter((v): v is string => typeof v === 'string' && v.trim() !== '');
    const code = typeof o.code === 'string' || typeof o.code === 'number' ? ` (code ${o.code})` : '';
    if (parts.length) return [...new Set(parts)].join(' — ') + code;
  }
  if (typeof e === 'string' && e.trim()) return e;
  return fallback;
}
