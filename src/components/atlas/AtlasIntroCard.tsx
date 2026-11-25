import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export type IntroDetails = { name: string; role: string; reason: string; email: string; note: string };
export const INTRO_REASONS = ['Hiring', 'A project', 'Just looking', 'Something else'] as const;

/**
 * "Introduce yourself" inside Atlas. Only the name is required; nothing is sent until the
 * visitor presses Send, and the card says exactly where it goes.
 */
const AtlasIntroCard = ({
  busy, error, onSend, onSkip,
}: { busy: boolean; error: string; onSend: (d: IntroDetails) => void; onSkip: () => void }) => {
  const [d, setD] = useState<IntroDetails>({ name: '', role: '', reason: '', email: '', note: '' });
  const [touched, setTouched] = useState(false);
  const set = (k: keyof IntroDetails, v: string) => setD(prev => ({ ...prev, [k]: v }));
  const nameMissing = touched && !d.name.trim();
  const field = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-[15px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40';

  return (
    <div>
      <p className="text-[15px] leading-relaxed text-foreground/90">
        Lovely. Tell me a little about yourself and I'll pass it on to Qomardeen. Only your name is needed.
      </p>
      <form
        className="mt-4 space-y-4 rounded-2xl border border-border p-4"
        onSubmit={e => { e.preventDefault(); setTouched(true); if (d.name.trim()) onSend(d); }}
        noValidate
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Your name</span>
          <input
            className={field}
            value={d.name}
            onChange={e => set('name', e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="name"
            maxLength={100}
            aria-invalid={nameMissing}
            aria-describedby={nameMissing ? 'intro-name-error' : undefined}
            autoFocus
          />
          {nameMissing && <span id="intro-name-error" className="mt-1 block text-xs text-destructive">Add your name so he knows who visited.</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">What do you do? <span className="font-normal text-muted-foreground">(optional)</span></span>
          <input className={field} value={d.role} onChange={e => set('role', e.target.value)} maxLength={150} placeholder="e.g. Recruiter at a fintech startup" autoComplete="organization-title" />
        </label>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">What brings you here? <span className="font-normal text-muted-foreground">(optional)</span></legend>
          <div role="radiogroup" aria-label="What brings you here?" className="flex flex-wrap gap-2">
            {INTRO_REASONS.map(r => {
              const on = d.reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set('reason', on ? '' : r)}
                  className={`h-10 rounded-full border px-3.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    on ? 'border-foreground bg-foreground text-background' : 'border-border text-foreground hover:border-foreground/40'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </fieldset>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email <span className="font-normal text-muted-foreground">(optional, if you'd like a reply)</span></span>
          <input className={field} type="email" value={d.email} onChange={e => set('email', e.target.value)} maxLength={255} autoComplete="email" inputMode="email" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Anything you'd like to say? <span className="font-normal text-muted-foreground">(optional)</span></span>
          <textarea className={`${field} min-h-[72px] resize-y`} value={d.note} onChange={e => set('note', e.target.value)} maxLength={1000} rows={2} />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">This goes to Qomardeen only, by email and in his dashboard.</p>
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Sending…' : 'Send to Qomardeen'}
          </button>
          <button type="button" onClick={onSkip} disabled={busy} className="inline-flex h-11 items-center justify-center rounded-full border border-border px-4 text-sm font-medium hover:border-foreground/40">
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default AtlasIntroCard;
