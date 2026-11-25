import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldAlert, Copy, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getTotpFactor, startEnrollment, confirmEnrollment, removeFactor, isSixDigits } from '@/lib/mfa';
import { errorMessage } from '@/lib/errorMessage';

type Factor = Awaited<ReturnType<typeof getTotpFactor>>;
type Setup = { factorId: string; qr: string; secret: string };

/** Admin › Security: turn two-step sign-in (an authenticator app code) on or off. */
const Security = () => {
  const [factor, setFactor] = useState<Factor>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState('');

  const load = async () => {
    try {
      setFactor(await getTotpFactor());
    } catch (e) {
      toast.error(errorMessage(e, 'Could not load your security settings.'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const begin = async () => {
    setBusy(true);
    try {
      setSetup(await startEnrollment());
      setCode('');
    } catch (e) {
      toast.error(errorMessage(e, 'Could not start the setup.'), { duration: 12000 });
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setup || !isSixDigits(code)) return;
    setBusy(true);
    try {
      await confirmEnrollment(setup.factorId, code);
      setSetup(null);
      toast.success('Two-step sign-in is on. You will need a code from the app every time you sign in.');
      await load();
    } catch (e) {
      setCode('');
      toast.error(errorMessage(e, 'That code did not work.'));
    } finally {
      setBusy(false);
    }
  };

  const turnOff = async () => {
    if (!factor) return;
    if (!window.confirm('Turn off two-step sign-in? Anyone with your password could then open the studio.')) return;
    setBusy(true);
    try {
      await removeFactor(factor.id);
      toast.success('Two-step sign-in is off.');
      await load();
    } catch (e) {
      toast.error(errorMessage(e, 'Could not turn it off.'));
    } finally {
      setBusy(false);
    }
  };

  const copySecret = async () => {
    if (!setup) return;
    try {
      await navigator.clipboard.writeText(setup.secret);
      toast.success('Setup key copied.');
    } catch {
      toast.error('Copy failed. Select the key and copy it by hand.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">Security</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Two-step sign-in asks for a 6-digit code from an authenticator app after your password, so a stolen password alone can't open the studio.
        </p>

        <section className="card-elegant p-5 md:p-6">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Checking…</p>
          ) : factor ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold">Two-step sign-in is on</h2>
                  <p className="text-sm text-muted-foreground">
                    {factor.friendly_name || 'Authenticator app'} · added {new Date(factor.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button onClick={turnOff} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-secondary disabled:opacity-50">
                <Trash2 className="w-4 h-4" /> Turn off
              </button>
            </div>
          ) : setup ? (
            <div className="grid md:grid-cols-[200px_minmax(0,1fr)] gap-6 items-start">
              <div className="rounded-xl bg-white p-3 w-[200px]">
                <img src={setup.qr} alt="QR code to add Qomardeen Studio to your authenticator app" className="w-full h-auto" />
              </div>
              <form onSubmit={confirm} className="space-y-4">
                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-muted-foreground">
                  <li>Open an authenticator app on your phone (Google Authenticator, Microsoft Authenticator, 1Password or Authy).</li>
                  <li>Scan the QR code, or type the setup key below.</li>
                  <li>Enter the 6-digit code the app shows.</li>
                </ol>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Setup key</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-secondary rounded-lg px-2.5 py-1.5 break-all">{setup.secret}</code>
                    <button type="button" onClick={copySecret} aria-label="Copy setup key" className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    aria-label="6-digit code from the app"
                    placeholder="000000"
                    className="w-full sm:w-44 px-4 py-2.5 bg-secondary border border-border rounded-xl text-center text-lg font-mono tracking-[0.4em] outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button type="submit" disabled={busy || !isSixDigits(code)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Turn on'}
                  </button>
                  <button type="button" onClick={() => setSetup(null)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold">Two-step sign-in is off</h2>
                  <p className="text-sm text-muted-foreground">Your password is the only thing protecting the studio.</p>
                </div>
              </div>
              <button onClick={begin} disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Set up
              </button>
            </div>
          )}
        </section>

        <p className="text-xs text-muted-foreground mt-4 max-w-xl">
          Lost your phone? Your app can't be removed from here without a code. Open your project in Lovable and ask it to "delete the MFA factors for my admin account". Then sign in with your password and set it up again on the new phone.
        </p>
      </div>
    </AdminLayout>
  );
};

export default Security;
