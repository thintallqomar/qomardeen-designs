import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Icon3D from '@/components/Icon3D';
import { getMfaState, verifyCode, isSixDigits } from '@/lib/mfa';
import { errorMessage } from '@/lib/errorMessage';
import { refreshStaffAuth } from '@/hooks/useStaffAuth';

/** Wrong authenticator codes allowed before the half-finished sign-in is cancelled. */
const MAX_CODE_TRIES = 5;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rawNext = params.get('next');
  // Only allow same-origin relative paths as a post-login destination.
  const next = rawNext && /^\/(?!\/)/.test(rawNext) ? rawNext : null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  // Second step: the 6-digit code from the authenticator app.
  const [step, setStep] = useState<'password' | 'code'>('password');
  const [code, setCode] = useState('');
  const [codeTries, setCodeTries] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  // Arriving with the password already accepted (e.g. sent back from an admin page): ask for the code.
  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const mfa = await getMfaState();
      if (live && mfa.needsCode) {
        setEmail(session.user.email ?? '');
        setStep('code');
      }
    })();
    return () => { live = false; };
  }, []);

  useEffect(() => { if (step === 'code') codeRef.current?.focus(); }, [step]);

  const handleForgot = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Enter your email above first, then click "Forgot password?"');
      return;
    }
    setResetSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetSending(false);
    if (error) toast.error(error.message);
    else toast.success('If that email has an account, a reset link is on its way.');
  };

  const guard = async (payload: Record<string, unknown>) => {
    try {
      const { data } = await supabase.functions.invoke('admin-login-guard', { body: payload });
      return data as { allowed?: boolean; remaining?: number; retryAfterSeconds?: number } | null;
    } catch {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedUntil && Date.now() < lockedUntil) {
      toast.error('Too many failed attempts. Please try again later.');
      return;
    }
    setLoading(true);

    try {
      const check = await guard({ action: 'check', email });
      if (check && check.allowed === false) {
        setLockedUntil(Date.now() + (check.retryAfterSeconds ?? 900) * 1000);
        toast.error('Account temporarily locked after repeated failed sign-ins. Try again in 15 minutes.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        await guard({ action: 'record', email, success: false });
        throw error;
      }

      // Password accepted. If this account has an authenticator, ask for its code next.
      const mfa = await getMfaState();
      if (mfa.needsCode) {
        setStep('code');
        setLoading(false);
        return;
      }
      await finishSignIn();
    } catch (err) {
      toast.error(errorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  /** Last step for both paths: confirm the account is an admin, then open the studio. */
  const finishSignIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      await guard({ action: 'record', email: user.email ?? email, success: false });
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    await guard({ action: 'record', email: user.email ?? email, success: true });
    await refreshStaffAuth(); // so the studio opens straight away instead of bouncing back here
    toast.success('Welcome back!');
    navigate(next ?? '/admin');
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSixDigits(code)) {
      toast.error('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setLoading(true);
    try {
      await verifyCode(code);
      await finishSignIn();
    } catch (err) {
      const tries = codeTries + 1;
      setCodeTries(tries);
      setCode('');
      if (tries >= MAX_CODE_TRIES) {
        // Too many wrong codes: drop the half-signed-in session and count it as a failed sign-in.
        await supabase.auth.signOut();
        await guard({ action: 'record', email, success: false });
        setStep('password');
        setPassword('');
        setCodeTries(0);
        toast.error('Too many wrong codes. Sign in again.');
      } else {
        toast.error(errorMessage(err, 'That code did not work.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const useAnotherAccount = async () => {
    await supabase.auth.signOut();
    setStep('password');
    setPassword('');
    setCode('');
    setCodeTries(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="card-elegant p-8">
          <div className="flex justify-center mb-6">
            <Icon3D variant="primary" size="lg">
              {step === 'code' ? <ShieldCheck /> : <Lock />}
            </Icon3D>
          </div>
          <h1 className="text-xl font-bold text-center mb-1">{step === 'code' ? 'Enter your code' : 'Admin Access'}</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {step === 'code' ? 'Open your authenticator app and type the 6-digit code for Qomardeen Studio.' : 'Sign in to your studio'}
          </p>

          {step === 'code' ? (
            <form onSubmit={handleCode} className="space-y-4">
              <input
                ref={codeRef}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                aria-label="6-digit code"
                placeholder="000000"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-center text-2xl font-mono tracking-[0.5em] text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={loading || !isSixDigits(code)}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify and sign in'}
              </button>
              {codeTries > 0 && (
                <p className="text-xs text-muted-foreground text-center">{MAX_CODE_TRIES - codeTries} tries left before you need to sign in again.</p>
              )}
              <button type="button" onClick={useAnotherAccount} className="w-full text-xs text-muted-foreground hover:text-foreground">
                Use a different account
              </button>
            </form>
          ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-4 pr-11 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-right -mt-1">
              <button
                type="button"
                onClick={handleForgot}
                disabled={resetSending}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                {resetSending ? 'Sending…' : 'Forgot password?'}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !!(lockedUntil && Date.now() < lockedUntil)}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
            {lockedUntil && Date.now() < lockedUntil && (
              <p className="text-xs text-destructive text-center">
                Sign-in locked after repeated failures. Try again in a few minutes.
              </p>
            )}
          </form>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto mt-4"
        >
          <ArrowLeft className="w-3 h-3" /> Back to site
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
