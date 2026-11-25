import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import i18n from 'i18next';
import { ArrowDown, ArrowUp, Check, ExternalLink, Loader2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canPublish } from '@/lib/roles';
import { supportedLanguages, languageNames, type SupportedLanguage } from '@/i18n';
import {
  aboutDefaults, cleanAbout, fetchAbout, mergeAbout, saveAbout,
  type AboutContent, type Cert, type Job, type Principle, type School,
} from '@/lib/aboutContent';

/* ── small form pieces ─────────────────────────────────────────────── */
const input = 'w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary';

const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label className="block">
    <span className="text-sm font-medium">{label}</span>
    {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
    <div className="mt-1.5">{children}</div>
  </label>
);

const Section = ({ title, description, children }: { title: string; description?: string; children: ReactNode }) => (
  <section className="card-elegant p-5 md:p-6 space-y-4">
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    {children}
  </section>
);

const RowTools = ({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (to: number) => void; onRemove: () => void; label: string }) => (
  <div className="flex shrink-0 items-start gap-0.5">
    <button type="button" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index - 1)} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
    <button type="button" aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(index + 1)} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
    <button type="button" aria-label={`Remove ${label}`} onClick={onRemove} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
  </div>
);

const move = <T,>(arr: T[], from: number, to: number) => {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** A list of one-line texts (skills, facts, paragraphs). */
const TextList = ({ items, onChange, label, multiline, max }: { items: string[]; onChange: (v: string[]) => void; label: string; multiline?: boolean; max: number }) => (
  <div className="space-y-2">
    {items.map((it, i) => (
      <div key={i} className="flex gap-2">
        {multiline ? (
          <textarea aria-label={`${label} ${i + 1}`} value={it} rows={3} onChange={e => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} className={`${input} leading-relaxed`} />
        ) : (
          <input aria-label={`${label} ${i + 1}`} value={it} onChange={e => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} className={input} />
        )}
        <RowTools index={i} count={items.length} label={`${label} ${i + 1}`} onMove={to => onChange(move(items, i, to))} onRemove={() => onChange(items.filter((_, k) => k !== i))} />
      </div>
    ))}
    {items.length < max && (
      <button type="button" onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        <Plus className="h-4 w-4" /> Add {label.toLowerCase()}
      </button>
    )}
  </div>
);

/** A list of small records (jobs, schools, certificates, principles). */
/* Type comes from `items`; JSX like <RecordList<School>> breaks Lovable's preview build, so don't add it. */
function RecordList<T extends Record<string, string>>({
  items, onChange, label, fields, blank, max,
}: { items: T[]; onChange: (v: T[]) => void; label: string; fields: { key: keyof T; label: string; long?: boolean; placeholder?: string }[]; blank: T; max: number }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-border p-3 md:p-4">
          <div className="flex items-start gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {fields.map(f => (
                <div key={String(f.key)} className={f.long ? 'sm:col-span-2' : ''}>
                  <Field label={f.label}>
                    {f.long ? (
                      <textarea value={it[f.key]} rows={3} placeholder={f.placeholder} onChange={e => onChange(items.map((x, k) => (k === i ? { ...x, [f.key]: e.target.value } : x)))} className={`${input} leading-relaxed`} />
                    ) : (
                      <input value={it[f.key]} placeholder={f.placeholder} onChange={e => onChange(items.map((x, k) => (k === i ? { ...x, [f.key]: e.target.value } : x)))} className={input} />
                    )}
                  </Field>
                </div>
              ))}
            </div>
            <RowTools index={i} count={items.length} label={`${label} ${i + 1}`} onMove={to => onChange(move(items, i, to))} onRemove={() => onChange(items.filter((_, k) => k !== i))} />
          </div>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { ...blank }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Plus className="h-4 w-4" /> Add {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}

/* ── the editor ────────────────────────────────────────────────────── */
const AboutEditor = () => {
  const access = useStaffAuth();
  const qc = useQueryClient();
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [form, setForm] = useState<AboutContent | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['about-content-admin'], queryFn: fetchAbout, retry: false });

  const defaults = useMemo(() => aboutDefaults(i18n.getFixedT(lang)), [lang]);
  const saved = data?.langs?.[lang];
  const baseline = useMemo(() => mergeAbout(defaults, saved), [defaults, saved]);

  // Load the chosen language into the form (only when the data or language changes).
  useEffect(() => { if (data || isError) setForm(baseline); }, [baseline, data, isError]);

  const dirty = !!form && JSON.stringify(cleanAbout(form)) !== JSON.stringify(cleanAbout(baseline));
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) => setForm(f => (f ? { ...f, [k]: v } : f));
  const author = { userId: access.userId, email: access.email };
  const allowed = canPublish(access);

  const switchLang = (next: SupportedLanguage) => {
    if (dirty && !confirm('You have unsaved changes. Switch language and lose them?')) return;
    setLang(next);
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await saveAbout(lang, form, author);
      await refetch();
      qc.invalidateQueries({ queryKey: ['about-content'] });
      toast.success(`About page (${languageNames[lang]}) saved. It's live now.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save. Nothing on the site changed.');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm(`Go back to the built-in ${languageNames[lang]} text? Your edits for this language will be removed.`)) return;
    setSaving(true);
    try {
      await saveAbout(lang, null, author);
      await refetch();
      qc.invalidateQueries({ queryKey: ['about-content'] });
      toast.success(`${languageNames[lang]} About text is back to the built-in version.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not reset.');
    } finally {
      setSaving(false);
    }
  };

  const codeShare = form ? 100 - Math.max(0, Math.min(100, Math.round(Number(form.designShare) || 0))) : 0;

  return (
    <AdminLayout>
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur px-4 md:px-10 py-3">
        <div className="flex max-w-4xl flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold">About page</h1>
            <p className="text-xs text-muted-foreground">
              {saved ? `Showing your edited ${languageNames[lang]} text.` : `Showing the built-in ${languageNames[lang]} text. Edit and save to change it.`}
              {dirty && ' · Unsaved changes'}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Language</span>
            <select value={lang} onChange={e => switchLang(e.target.value as SupportedLanguage)} className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm">
              {supportedLanguages.map(l => (
                <option key={l} value={l}>{languageNames[l]}{data?.langs?.[l] ? ' (edited)' : ''}</option>
              ))}
            </select>
          </label>
          <a href={`/${lang}/about`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm hover:bg-secondary">
            <ExternalLink className="h-4 w-4" /> View
          </a>
          {saved && (
            <button type="button" onClick={reset} disabled={saving || !allowed} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-3 text-sm hover:bg-secondary disabled:opacity-50">
              <RotateCcw className="h-4 w-4" /> Use built-in
            </button>
          )}
          <button type="button" onClick={save} disabled={!dirty || saving || !allowed} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
          </button>
        </div>
      </div>

      <div className="p-4 md:p-10 max-w-4xl space-y-6">
        {!allowed && <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">Only Admin and Editor accounts can change the About page.</p>}
        {isError && <p className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive">Couldn't load your saved edits. You're seeing the built-in text; saving will still work.</p>}
        {(isLoading || !form) && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}

        {form && (
          <>
            <Section title="Opening" description="The big word at the top, the line under it, and the CV button.">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                <Field label="Big word" hint="Shown in lowercase with a dot, like “about.”"><input value={form.word} onChange={e => set('word', e.target.value)} className={input} maxLength={40} /></Field>
                <Field label="CV button"><input value={form.cvLabel} onChange={e => set('cvLabel', e.target.value)} className={input} maxLength={40} /></Field>
              </div>
              <Field label="Intro line"><textarea value={form.lead} onChange={e => set('lead', e.target.value)} rows={3} className={`${input} leading-relaxed`} maxLength={600} /></Field>
            </Section>

            <Section title="Designer / coder card" description="The two labels, the split bar and the two lists under it.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Designer label"><input value={form.designerLabel} onChange={e => set('designerLabel', e.target.value)} className={input} maxLength={40} /></Field>
                <Field label="Coder label"><input value={form.coderLabel} onChange={e => set('coderLabel', e.target.value)} className={input} maxLength={40} /></Field>
                <Field label="Design share (%)" hint={`Code share becomes ${codeShare}%`}>
                  <input type="number" min={0} max={100} step={5} value={form.designShare} onChange={e => set('designShare', Number(e.target.value))} className={input} />
                </Field>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Designer list"><TextList items={form.designer} onChange={v => set('designer', v)} label="Designer item" max={12} /></Field>
                <Field label="Coder list"><TextList items={form.coder} onChange={v => set('coder', v)} label="Coder item" max={12} /></Field>
              </div>
            </Section>

            <Section title="Random facts" description="Icons are picked from the words in each fact (games, food, anatomy, music, travel…).">
              <Field label="Heading"><input value={form.factsTitle} onChange={e => set('factsTitle', e.target.value)} className={input} maxLength={80} /></Field>
              <TextList items={form.facts} onChange={v => set('facts', v)} label="Fact" max={12} />
            </Section>

            <Section title="Bio" description="One box per paragraph. The last paragraph is shown slightly bolder.">
              <TextList items={form.bio} onChange={v => set('bio', v)} label="Paragraph" multiline max={10} />
            </Section>

            <Section title="Education">
              <Field label="Heading"><input value={form.educationTitle} onChange={e => set('educationTitle', e.target.value)} className={input} maxLength={60} /></Field>
              <RecordList
                items={form.education} onChange={v => set('education', v)} label="School" max={12}
                blank={{ dates: '', title: '', place: '' }}
                fields={[{ key: 'title', label: 'Course or degree' }, { key: 'dates', label: 'Dates', placeholder: 'Sep 2026 – Present' }, { key: 'place', label: 'School and place', long: true }]}
              />
            </Section>

            <Section title="Experience" description="Newest first. The first role gets the highlighted dot.">
              <Field label="Heading"><input value={form.experienceTitle} onChange={e => set('experienceTitle', e.target.value)} className={input} maxLength={60} /></Field>
              <RecordList
                items={form.experience} onChange={v => set('experience', v)} label="Role" max={15}
                blank={{ title: '', meta: '', place: '', note: '', body: '' }}
                fields={[
                  { key: 'title', label: 'Role — company' },
                  { key: 'meta', label: 'Dates or tag', placeholder: 'Aug 2025 – Jan 2026' },
                  { key: 'place', label: 'Company or place' },
                  { key: 'note', label: 'Small note (optional)', placeholder: 'Promoted from …' },
                  { key: 'body', label: 'What you did', long: true },
                ]}
              />
            </Section>

            <Section title="Certifications">
              <Field label="Heading"><input value={form.certificationsTitle} onChange={e => set('certificationsTitle', e.target.value)} className={input} maxLength={60} /></Field>
              <RecordList
                items={form.certifications} onChange={v => set('certifications', v)} label="Certificate" max={30}
                blank={{ title: '', meta: '' }}
                fields={[{ key: 'title', label: 'Certificate' }, { key: 'meta', label: 'Issuer and date', placeholder: 'Google (Coursera) — Jan 2024' }]}
              />
            </Section>

            <Section title="Design philosophy">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Heading"><input value={form.philosophyTitle} onChange={e => set('philosophyTitle', e.target.value)} className={input} maxLength={80} /></Field>
                <Field label="Line under the heading"><input value={form.philosophySubtitle} onChange={e => set('philosophySubtitle', e.target.value)} className={input} maxLength={300} /></Field>
              </div>
              <RecordList
                items={form.principles} onChange={v => set('principles', v)} label="Principle" max={10}
                blank={{ title: '', body: '' }}
                fields={[{ key: 'title', label: 'Principle', long: true }, { key: 'body', label: 'Explanation', long: true }]}
              />
            </Section>

            <p className="text-xs text-muted-foreground">
              Each language is saved separately, so editing English doesn't change the other languages. Rows without a title (and empty lines) are removed when you save.
              Atlas, the AI guide, reads this page too, so it stays up to date with your edits.
            </p>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AboutEditor;
