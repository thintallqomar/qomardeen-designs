import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KeyRound, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Icon3D from '@/components/Icon3D';

const inputCls =
  'w-full pl-4 pr-11 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary';

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (password !== confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success('Password updated. Please sign in.');
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="card-elegant p-8">
          <div className="flex justify-center mb-6">
            <Icon3D variant="primary" size="lg"><KeyRound /></Icon3D>
          </div>
          <h1 className="text-xl font-bold text-center mb-1">Set a new password</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {ready ? 'Choose a strong password you will remember.' : 'Open this page from the reset link in your email.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ v: password, set: setPassword, ph: 'New password' }, { v: confirm, set: setConfirm, ph: 'Confirm password' }].map((f) => (
              <div key={f.ph} className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={f.v}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.ph}
                  required
                  disabled={!ready}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
            </button>
          </form>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto mt-4"
        >
          <ArrowLeft className="w-3 h-3" /> Back to sign in
        </button>
      </div>
    </div>
  );
};

export default AdminResetPassword;
