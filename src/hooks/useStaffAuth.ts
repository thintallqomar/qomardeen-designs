import { useSyncExternalStore } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { computeStaffAccess, type StaffAccess, type StaffRole } from '@/lib/roles';
import { getMfaState } from '@/lib/mfa';

export type { StaffRole };

interface StaffAuthState extends StaffAccess {
  loading: boolean;
  userId: string | null;
  email: string | null;
  /** Password accepted, but the authenticator code has not been entered yet. Not staff until it is. */
  needsMfa: boolean;
  /** The account has two-step sign-in turned on. */
  mfaEnabled: boolean;
}

const EMPTY: StaffAuthState = {
  loading: true,
  userId: null,
  email: null,
  needsMfa: false,
  mfaEnabled: false,
  ...computeStaffAccess([]),
};

/*
 * One shared, server-verified answer to "who is signed in and what may they do", for the whole app.
 *
 * Before, every admin page, the route guard, the admin layout and Atlas each asked the database
 * on their own, and each showed a loading spinner first. Moving between admin pages flashed two
 * spinners and sent up to six role lookups. Now the answer is worked out once, kept, and only
 * refreshed when the sign-in actually changes (without going back to a spinner).
 * Roles still always come from the database, never from the browser.
 */
let state: StaffAuthState = EMPTY;
const listeners = new Set<() => void>();
let started = false;
let run = 0;

const emit = (next: StaffAuthState) => {
  state = next;
  listeners.forEach(l => l());
};

async function resolve() {
  const mine = ++run;
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) {
    if (mine === run) emit({ ...EMPTY, loading: false });
    return;
  }
  const mfa = await getMfaState();
  if (mfa.needsCode) {
    if (mine === run) emit({ ...EMPTY, loading: false, userId: user.id, email: user.email ?? null, needsMfa: true, mfaEnabled: true });
    return;
  }
  const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
  if (mine !== run) return; // a newer check started meanwhile
  emit({
    loading: false,
    userId: user.id,
    email: user.email ?? null,
    needsMfa: false,
    mfaEnabled: mfa.enabled,
    ...computeStaffAccess((data ?? []).map(r => r.role)),
  });
}

function start() {
  if (started) return;
  started = true;
  void resolve();
  supabase.auth.onAuthStateChange((event, session) => {
    // A token refresh doesn't change who you are or your roles: no need to ask again.
    if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') return;
    if (event === 'SIGNED_OUT' || !session) { run++; emit({ ...EMPTY, loading: false }); return; }
    setTimeout(() => void resolve(), 0);
  });
}

const subscribe = (l: () => void) => {
  start();
  listeners.add(l);
  return () => { listeners.delete(l); };
};
const snapshot = () => state;

/** Server-verified role state, shared across the app. */
export const useStaffAuth = (): StaffAuthState => useSyncExternalStore(subscribe, snapshot, snapshot);

/** Re-check now (e.g. right after signing in or entering the code). */
export const refreshStaffAuth = () => resolve();
