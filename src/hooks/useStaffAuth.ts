import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { computeStaffAccess, type StaffAccess, type StaffRole } from '@/lib/roles';

export type { StaffRole };

interface StaffAuthState extends StaffAccess {
  loading: boolean;
  userId: string | null;
  email: string | null;
}

const EMPTY: StaffAuthState = {
  loading: true,
  userId: null,
  email: null,
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
