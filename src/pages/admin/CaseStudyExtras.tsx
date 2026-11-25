/*
 * Extra parts of the case study editor: videos, header facts, the prototype section, extra blocks
 * (numbers, lists, text + image, steps) and the "next case study" link.
 */
import { Plus, Trash2, ChevronUp, ChevronDown, X, ImagePlus, Film } from 'lucide-react';
import {
  BLOCK_TYPES, type CaseStudyBlock, type CaseStudyBlockType, type CaseStudyBody, type CaseStudyFact,
} from '@/lib/cms';

export const input = 'w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary';
const small = 'text-xs font-medium text-muted-foreground uppercase tracking-wider';
const iconBtn = 'p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30';

export const Lbl = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <label className="block">
    <span className={small}>{label}</span>
    {hint && <span className="block text-[11px] text-muted-foreground/70 mt-0.5">{hint}</span>}
    <div className="mt-1.5">{children}</div>
  </label>
);

/** A video: preview, link, and a button to choose or upload one in the media library. */
export const VideoField = ({ value, onPick, onChange }: { value?: string; onPick: () => void; onChange: (url: string) => void }) => (
  <div>
    {value && (
      <div className="relative mb-2">
        <video src={value} muted playsInline controls preload="metadata" className="w-full rounded-xl border border-border bg-black" />
        <button type="button" onClick={() => onChange('')} aria-label="Remove video"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/90 border border-border text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
    <div className="flex gap-2">
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder="Video URL (MP4)" className={input} />
      <button type="button" onClick={onPick} aria-label="Choose or upload a video"
        className="shrink-0 px-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
        <Film className="w-4 h-4" />
      </button>
    </div>
  </div>
);

/** A compact image picker row (preview + URL + library button). */
export const SmallImage = ({ value, onPick, onChange, placeholder = 'Image URL' }: { value?: string; onPick: () => void; onChange: (url: string) => void; placeholder?: string }) => (
  <div className="flex gap-2 items-center">
    {value ? <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" /> : null}
    <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={input} />
    <button type="button" onClick={onPick} aria-label="Choose from media library" className="shrink-0 px-3 py-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
      <ImagePlus className="w-4 h-4" />
    </button>
  </div>
);

const move = <T,>(list: T[], i: number, dir: -1 | 1) => {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

const SectionCard = ({ title, hint, children, action }: { title: string; hint?: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <section>
    <div className="flex items-center justify-between mb-3 gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
        {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

/* ── Header facts ── */
export const FactsEditor = ({ facts, onChange }: { facts: CaseStudyFact[]; onChange: (f: CaseStudyFact[]) => void }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className={small}>Facts row (optional)</span>
      <button type="button" onClick={() => onChange([...facts, { label: '', value: '' }])} className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
    </div>
    <p className="text-[11px] text-muted-foreground/70 mb-2">Leave empty to show Role, Scope, Platform and Timeline. Add your own to change the labels or the order (e.g. Tools, Built with).</p>
    <div className="space-y-2">
      {facts.map((f, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input value={f.label} onChange={e => onChange(facts.map((x, j) => j === i ? { ...x, label: e.target.value, labelKey: undefined } : x))} placeholder="Label" className={`${input} w-40`} />
          <input value={f.value} onChange={e => onChange(facts.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="Value" className={input} />
          <button type="button" onClick={() => onChange(move(facts, i, -1))} disabled={i === 0} aria-label="Move up" className={iconBtn}><ChevronUp className="w-4 h-4" /></button>
          <button type="button" onClick={() => onChange(facts.filter((_, j) => j !== i))} aria-label="Remove" className={`${iconBtn} hover:text-destructive`}><X className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  </div>
);

/* ── Prototype section ── */
export const PrototypeEditor = ({ cs, set, pickVideo, pickPoster }: {
  cs: CaseStudyBody; set: (p: CaseStudyBody['prototype']) => void; pickVideo: () => void; pickPoster: () => void;
}) => {
  const p = cs.prototype ?? {};
  const on = !!cs.prototype;
  const upd = (patch: Partial<NonNullable<CaseStudyBody['prototype']>>) => set({ ...p, ...patch });
  return (
    <SectionCard
      title="Prototype walkthrough"
      hint="Optional. A video of the clickable prototype, plus a button to try it."
      action={on
        ? <button type="button" onClick={() => set(undefined)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
        : <button type="button" onClick={() => set({ title: 'The prototype, tap by tap', buttonLabel: 'Try it yourself in Figma' })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/70"><Plus className="w-4 h-4" /> Add</button>}
    >
      {on && (
        <div className="card-elegant p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Lbl label="Heading"><input value={p.title ?? ''} onChange={e => upd({ title: e.target.value })} className={input} /></Lbl>
            <Lbl label="Button text"><input value={p.buttonLabel ?? ''} onChange={e => upd({ buttonLabel: e.target.value })} className={input} /></Lbl>
          </div>
          <Lbl label="Text"><textarea value={p.description ?? ''} onChange={e => upd({ description: e.target.value })} rows={3} className={input} /></Lbl>
          <Lbl label="Prototype link"><input value={p.url ?? ''} onChange={e => upd({ url: e.target.value })} placeholder="https://www.figma.com/proto/…" className={input} /></Lbl>
          <div className="grid sm:grid-cols-2 gap-3">
            <Lbl label="Walkthrough video"><VideoField value={p.video} onPick={pickVideo} onChange={url => upd({ video: url })} /></Lbl>
            <Lbl label="Poster image" hint="Shown before the video plays."><SmallImage value={p.poster} onPick={pickPoster} onChange={url => upd({ poster: url })} /></Lbl>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

/* ── Extra blocks ── */
const emptyBlock = (type: CaseStudyBlockType): CaseStudyBlock => {
  switch (type) {
    case 'stats': return { type, title: 'Results so far', items: [{ value: 0, suffix: '%', label: '' }] };
    case 'list': return { type, title: 'Key decisions', numbered: true, asideLabel: 'Trade-off', items: [{ title: '', body: '', aside: '' }] };
    case 'feature': return { type, title: '', items: [{ title: '', body: '' }] };
    case 'steps': return { type, title: '', items: [{ title: '', body: '' }] };
    default: return { type: 'bullets', title: "What's next", items: [''] };
  }
};

export const BlocksEditor = ({ blocks, onChange, pickImage }: {
  blocks: CaseStudyBlock[]; onChange: (b: CaseStudyBlock[]) => void; pickImage: (index: number, field: 'image' | 'zoomImage') => void;
}) => {
  const upd = (i: number, patch: Partial<CaseStudyBlock>) => onChange(blocks.map((b, j) => (j === i ? ({ ...b, ...patch } as CaseStudyBlock) : b)));
  return (
    <SectionCard
      title="Extra sections"
      hint="Optional sections after the story: numbers, decisions, text with an image, steps or a short list."
      action={
        <select
          value=""
          onChange={e => { if (e.target.value) onChange([...blocks, emptyBlock(e.target.value as CaseStudyBlockType)]); }}
          className={`${input} w-auto`}
          aria-label="Add a section"
        >
          <option value="">+ Add section…</option>
          {BLOCK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      }
    >
      {blocks.length === 0 && (
        <p className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">No extra sections.</p>
      )}
      <div className="space-y-4">
        {blocks.map((b, i) => {
          const meta = BLOCK_TYPES.find(t => t.value === b.type)!;
          return (
            <div key={i} className="card-elegant p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{meta.label} · <span className="text-muted-foreground/70">{meta.blurb}</span></span>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => onChange(move(blocks, i, -1))} disabled={i === 0} aria-label="Move up" className={iconBtn}><ChevronUp className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onChange(move(blocks, i, 1))} disabled={i === blocks.length - 1} aria-label="Move down" className={iconBtn}><ChevronDown className="w-4 h-4" /></button>
                  <button type="button" onClick={() => onChange(blocks.filter((_, j) => j !== i))} aria-label="Remove section" className={`${iconBtn} hover:text-destructive`}><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
                <Lbl label="Heading"><input value={b.title} onChange={e => upd(i, { title: e.target.value })} className={input} /></Lbl>
                <Lbl label="Where">
                  <select value={b.placement ?? 'beforeFrames'} onChange={e => upd(i, { placement: e.target.value as CaseStudyBlock['placement'] })} className={input}>
                    <option value="beforeFrames">Before the frames</option>
                    <option value="afterFrames">After the frames</option>
                  </select>
                </Lbl>
                <Lbl label="Background">
                  <select value={b.tone ?? 'plain'} onChange={e => upd(i, { tone: e.target.value as CaseStudyBlock['tone'] })} className={input}>
                    <option value="plain">Plain</option>
                    <option value="muted">Tinted</option>
                  </select>
                </Lbl>
              </div>
              <Lbl label="Intro (optional)"><textarea value={b.intro ?? ''} onChange={e => upd(i, { intro: e.target.value })} rows={2} className={input} /></Lbl>

              {b.type === 'stats' && (
                <Rows
                  items={b.items}
                  onChange={items => upd(i, { items } as never)}
                  blank={{ value: 0, suffix: '', label: '' }}
                  render={(it, set) => (
                    <>
                      <input type="number" value={it.value} onChange={e => set({ value: Number(e.target.value) })} className={`${input} w-24`} aria-label="Number" />
                      <input value={it.suffix ?? ''} onChange={e => set({ suffix: e.target.value })} placeholder="%" className={`${input} w-16`} aria-label="Suffix" />
                      <input value={it.label} onChange={e => set({ label: e.target.value })} placeholder="What the number means" className={input} aria-label="Label" />
                    </>
                  )}
                />
              )}

              {b.type === 'list' && (
                <>
                  <div className="flex flex-wrap gap-4 items-center text-sm">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={b.numbered !== false} onChange={e => upd(i, { numbered: e.target.checked } as never)} /> Numbered</label>
                    <label className="flex items-center gap-2">Side note label <input value={b.asideLabel ?? ''} onChange={e => upd(i, { asideLabel: e.target.value } as never)} placeholder="Trade-off" className={`${input} w-40`} /></label>
                  </div>
                  <Rows
                    items={b.items}
                    onChange={items => upd(i, { items } as never)}
                    blank={{ title: '', body: '', aside: '' }}
                    stacked
                    render={(it, set) => (
                      <div className="grid gap-2 flex-1">
                        <input value={it.title} onChange={e => set({ title: e.target.value })} placeholder="Title" className={input} />
                        <textarea value={it.body} onChange={e => set({ body: e.target.value })} placeholder="Why" rows={2} className={input} />
                        <textarea value={it.aside ?? ''} onChange={e => set({ aside: e.target.value })} placeholder="Side note (optional)" rows={2} className={input} />
                      </div>
                    )}
                  />
                </>
              )}

              {(b.type === 'feature' || b.type === 'steps') && (
                <Rows
                  items={b.items}
                  onChange={items => upd(i, { items } as never)}
                  blank={{ title: '', body: '' }}
                  stacked
                  render={(it, set) => (
                    <div className="grid gap-2 flex-1">
                      <input value={it.title} onChange={e => set({ title: e.target.value })} placeholder="Title" className={input} />
                      <textarea value={it.body} onChange={e => set({ body: e.target.value })} placeholder="Text" rows={2} className={input} />
                    </div>
                  )}
                />
              )}

              {b.type === 'feature' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <Lbl label="Image"><SmallImage value={b.image} onPick={() => pickImage(i, 'image')} onChange={url => upd(i, { image: url } as never)} /></Lbl>
                  <Lbl label="Image alt text"><input value={b.imageAlt ?? ''} onChange={e => upd(i, { imageAlt: e.target.value } as never)} className={input} /></Lbl>
                  <Lbl label="Caption"><input value={b.caption ?? ''} onChange={e => upd(i, { caption: e.target.value } as never)} className={input} /></Lbl>
                  <Lbl label="Full-screen image (optional)" hint="Opens when the image is tapped."><SmallImage value={b.zoomImage} onPick={() => pickImage(i, 'zoomImage')} onChange={url => upd(i, { zoomImage: url } as never)} /></Lbl>
                </div>
              )}

              {b.type === 'steps' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={small}>Bullet columns (optional)</span>
                    <button type="button" onClick={() => upd(i, { columns: [...(b.columns ?? []), { title: '', items: [] }] } as never)} className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add column</button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(b.columns ?? []).map((c, ci) => (
                      <div key={ci} className="space-y-2">
                        <div className="flex gap-2">
                          <input value={c.title} onChange={e => upd(i, { columns: b.columns!.map((x, j) => j === ci ? { ...x, title: e.target.value } : x) } as never)} placeholder="Column title" className={input} />
                          <button type="button" onClick={() => upd(i, { columns: b.columns!.filter((_, j) => j !== ci) } as never)} aria-label="Remove column" className={`${iconBtn} hover:text-destructive`}><X className="w-4 h-4" /></button>
                        </div>
                        <textarea value={c.items.join('\n')} onChange={e => upd(i, { columns: b.columns!.map((x, j) => j === ci ? { ...x, items: e.target.value.split('\n') } : x) } as never)} rows={4} placeholder="One point per line" className={input} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {b.type === 'bullets' && (
                <Lbl label="Points" hint="One per line.">
                  <textarea value={b.items.join('\n')} onChange={e => upd(i, { items: e.target.value.split('\n') } as never)} rows={4} className={input} />
                </Lbl>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

/** Repeating rows with add / move / remove. */
function Rows<T>({ items, onChange, blank, render, stacked }: {
  items: T[]; onChange: (items: T[]) => void; blank: T; stacked?: boolean;
  render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div>
      <div className={stacked ? 'space-y-3' : 'space-y-2'}>
        {items.map((it, i) => (
          <div key={i} className={`flex gap-2 ${stacked ? 'items-start border-t border-border pt-3' : 'items-center'}`}>
            {render(it, patch => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))))}
            <div className={`flex ${stacked ? 'flex-col' : ''} gap-0.5 shrink-0`}>
              <button type="button" onClick={() => onChange(move(items, i, -1))} disabled={i === 0} aria-label="Move up" className={iconBtn}><ChevronUp className="w-4 h-4" /></button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove" className={`${iconBtn} hover:text-destructive`}><X className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, { ...blank }])} className="mt-2 text-xs text-primary hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add item</button>
    </div>
  );
}

/* ── Next case study link ── */
export const NextEditor = ({ next, onChange }: { next?: CaseStudyBody['next']; onChange: (n: CaseStudyBody['next']) => void }) => {
  const n = next ?? { title: '', route: '', blurb: '' };
  const upd = (patch: Partial<NonNullable<CaseStudyBody['next']>>) => {
    const merged = { ...n, ...patch };
    onChange(merged.title || merged.route || merged.blurb ? merged : undefined);
  };
  return (
    <SectionCard title="Next case study" hint="Optional. The link at the bottom of the page. Leave empty to suggest one automatically.">
      <div className="grid sm:grid-cols-2 gap-3">
        <Lbl label="Title"><input value={n.title} onChange={e => upd({ title: e.target.value })} placeholder="WalPay" className={input} /></Lbl>
        <Lbl label="Address"><input value={n.route} onChange={e => upd({ route: e.target.value })} placeholder="/projects/walpay" className={input} /></Lbl>
        <div className="sm:col-span-2"><Lbl label="One line about it"><input value={n.blurb ?? ''} onChange={e => upd({ blurb: e.target.value })} className={input} /></Lbl></div>
      </div>
    </SectionCard>
  );
};
