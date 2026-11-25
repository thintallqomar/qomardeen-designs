import { useStaffAuth } from '@/hooks/useStaffAuth';

/** Is the signed-in person an admin (with their authenticator code entered, if they use one)? Shares the one auth check. */
export const useAdminAuth = () => {
  const { isAdmin, loading } = useStaffAuth();
  return { isAdmin, loading };
};
