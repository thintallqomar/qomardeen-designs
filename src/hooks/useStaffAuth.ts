import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type StaffRole = 'admin' | 'editor' | 'contributor';

interface StaffAuthState {
  loading: boolean;
  userId: string | null;
  email: string | null;
  roles: StaffRole[];
  isStaff: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
}

const EMPTY: StaffAuthState = {
  loading: true,
  userId: null,
  email: null,
  roles: [],
  isStaff: false,
  isPublisher: false,
  isAdmin: false,
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
      const roles = ((data ?? []).map(r => r.role) as StaffRole[]).filter(r =>
        ['admin', 'editor', 'contributor'].includes(r)
      );
      if (!active) return;
      setState({
        loading: false,
        userId: user.id,
        email: user.email ?? null,
        roles,
        isStaff: roles.length > 0,
        isPublisher: roles.includes('admin') || roles.includes('editor'),
        isAdmin: roles.includes('admin'),
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