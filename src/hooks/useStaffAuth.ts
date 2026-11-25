import { useEffect, useState } from 'react';
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

/** Server-verified role state. Roles always come from the database, never from the client. */
export const useStaffAuth = (): StaffAuthState => {
  const [state, setState] = useState<StaffAuthState>(EMPTY);

  useEffect(() => {
    let active = true;

    const resolve = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        if (active) setState({ ...EMPTY, loading: false });
        return;
      }
      const mfa = await getMfaState();
      if (mfa.needsCode) {
        if (active) setState({ ...EMPTY, loading: false, userId: user.id, email: user.email ?? null, needsMfa: true, mfaEnabled: true });
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      const access = computeStaffAccess((data ?? []).map(r => r.role));
      if (!active) return;
      setState({
        loading: false,
        userId: user.id,
        email: user.email ?? null,
        needsMfa: false,
        mfaEnabled: mfa.enabled,
        ...access,
      });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setTimeout(resolve, 0);
    });
    resolve();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
