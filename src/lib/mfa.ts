import { supabase } from '@/integrations/supabase/client';
import { errorMessage } from '@/lib/errorMessage';

/**
 * Two-step sign-in for the admin (an authenticator app code after the password).
 *
 * Supabase marks a session "aal1" after the password and "aal2" after a valid code.
 * Once an account has an authenticator set up, the admin requires aal2: the browser
 * asks for the code, and the backend refuses staff actions from an aal1 session.
 */

export type MfaState = {
  /** The account has at least one confirmed authenticator. */
  enabled: boolean;
  /** Signed in with the password but the code has not been entered yet. */
  needsCode: boolean;
};

export async function getMfaState(): Promise<MfaState> {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return { enabled: false, needsCode: false };
  const enabled = data.nextLevel === 'aal2';
  return { enabled, needsCode: enabled && data.currentLevel !== 'aal2' };
}

/** The confirmed authenticator app, if there is one. */
export async function getTotpFactor() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data.totp.find(f => f.status === 'verified') ?? null;
}

/** Checks a 6-digit code against the account's authenticator and upgrades the session. */
export async function verifyCode(code: string) {
  const factor = await getTotpFactor();
  if (!factor) throw new Error('No authenticator app is set up for this account.');
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: code.trim() });
  if (error) throw new Error(/invalid|expired/i.test(error.message) ? 'That code is wrong or has expired. Try the newest one.' : error.message);
}

/** Starts setting up an authenticator app. Clears any half-finished setup first. */
export async function startEnrollment() {
  const { data: list } = await supabase.auth.mfa.listFactors();
  for (const f of list?.all ?? []) {
    if (f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
    issuer: 'Qomardeen Studio',
  });
  if (error) {
    if (/disabled|not enabled/i.test(error.message)) {
      throw new Error('Two-step sign-in is switched off for this backend. Turn on TOTP multi-factor authentication in the auth settings, then try again.');
    }
    throw error;
  }
  return { factorId: data.id, qr: safeQr(data.totp.qr_code), secret: data.totp.secret };
}

/** The QR comes back as raw SVG text in a data address; encode it so every browser shows it. */
function safeQr(qr: string) {
  const m = /^data:image\/svg\+xml;[^,]*,(.*)$/s.exec(qr);
  if (!m || /;base64,/.test(qr)) return qr;
  let svg = m[1];
  try { svg = decodeURIComponent(svg); } catch { /* already plain text */ }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Finishes setup with the first code from the app. */
export async function confirmEnrollment(factorId: string, code: string) {
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
  if (error) throw new Error(/invalid|expired/i.test(error.message) ? 'That code is wrong or has expired. Try the newest one.' : errorMessage(error));
}

export async function removeFactor(factorId: string) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
}

export const isSixDigits = (v: string) => /^\d{6}$/.test(v.trim());
