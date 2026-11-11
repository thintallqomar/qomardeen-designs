import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaPicker from '@/components/admin/MediaPicker';
import RichTextField from '@/components/admin/RichTextField';
import type { MediaAsset } from '@/lib/media';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canPublish } from '@/lib/roles';
import {
  fetchById, saveContent, slugify, estimateReading, logAudit,
  emptyCaseStudyBody,
  type ContentStatus, type ContentVisibility, type CaseStudyBody,
  type CaseStudySection, type CaseStudyFrame,
} from '@/lib/cms';
import {
  ArrowLeft, Save, Loader2, ImagePlus, X, Plus, Trash2, GripVertical, ChevronUp, ChevronDown,
} from 'lucide-react';

const STATUSES: ContentStatus[] = ['draft', 'published', 'scheduled', 'archived'];
const VISIBILITIES: ContentVisibility[] = ['public', 'unlisted', 'private'];

const input = 'w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary';

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <label className="block">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    {hint && <span className="block text-[11px] text-muted-foreground/70 mt-0.5">{hint}</span>}
    <div className="mt-1.5">{children}</div>
  </label>
);

/** Small reusable image field with a media-library picker. */
const ImageField = ({
  value, alt, onPick, onClear, onManualUrl,
}: {
  value: string; alt?: string;
  onPick: () => void; onClear: () => void; onManualUrl: (url: string) => void;
}) => (
  <div>
    {value && (
      <div className="relative mb-2">
        <img src={value} alt={alt || 'Preview'} className="w-full rounded-xl border border-border" />
        <button type="button" onClick={onClear} aria-label="Remove image"
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/90 border border-border text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
    <div className="flex gap-2">
      <input value={value} onChange={e => onManualUrl(e.target.value)} placeholder="Image URL" className={input} />
      <button type="button" onClick={onPick} aria-label="Choose from media library"
        className="shrink-0 px-3 rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
        <ImagePlus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

type PickerTarget =
  | { kind: 'cover' }
  | { kind: 'section'; index: number }
  | { kind: 'frame'; index: number };

const CaseStudyEditor = () => {
  const { id } = useParams();
  const typePath = 'case-studies';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const access = useStaffAuth();
  const isNew = !id || id === 'new';

  const { data: existing } = useQuery({
    queryKey: ['cms', 'item', id],
    queryFn: () => fetchById(id!),
    enabled: !isNew,
  });

  const [form, setForm] = useState({
    title: '', subtitle: '', slug: '', excerpt: '', tags: '',
    cover_image: '', cover_image_alt: '', seo_title: '', seo_description: '',
    status: 'draft' as ContentStatus, visibility: 'public' as ContentVisibility,
    is_featured: true, publish_date: '',
  });
  const [cs, setCs] = useState<CaseStudyBody>(emptyCaseStudyBody());
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<PickerTarget | null>(null);

  useEffect(() => {
    if (!existing) return;
    setForm({
      title: existing.title, subtitle: existing.subtitle ?? '', slug: existing.slug,
      excerpt: existing.excerpt ?? '', tags: (existing.tags ?? []).join(', '),
      cover_image: existing.cover_image ?? '', cover_image_alt: existing.cover_image_alt ?? '',
      seo_title: existing.seo_title ?? '', seo_description: existing.seo_description ?? '',
      status: existing.status, visibility: existing.visibility,
      is_featured: existing.is_featured,
      publish_date: existing.publish_date ? existing.publish_date.slice(0, 10) : '',
    });
    const body = (existing.body_json as CaseStudyBody | null) ?? emptyCaseStudyBody();
    setCs({
      ...emptyCaseStudyBody(),
      ...body,
      behanceUrl: body.behanceUrl ?? existing.resource_url ?? '',
      sections: Array.isArray(body.sections) ? body.sections : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
    });
    setSlugTouched(true);
  }, [existing]);

  const publisher = canPublish(access);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const setCsField = <K extends keyof CaseStudyBody>(k: K, v: CaseStudyBody[K]) =>
    setCs(prev => ({ ...prev, [k]: v }));

  // Reading estimate from all the prose in the case study
  const reading = useMemo(() => {
    const text = [form.excerpt, ...cs.sections.map(s => `${s.title} ${s.description}`)].join(' ');
    return estimateReading(text);
  }, [form.excerpt, cs.sections]);

  /* ── Section helpers ── */
  const addSection = () =>
    setCs(prev => ({ ...prev, sections: [...prev.sections, { title: '', subtitle: '', description: '', image: '', imageAlt: '', metrics: [] }] }));
  const updateSection = (i: number, patch: Partial<CaseStudySection>) =>
    setCs(prev => ({ ...prev, sections: prev.sections.map((s, idx) => idx === i ? { ...s, ...patch } : s) }));
  const removeSection = (i: number) =>
    setCs(prev => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));
  const moveSection = (i: number, dir: -1 | 1) =>
    setCs(prev => {
      const next = [...prev.sections];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, sections: next };
    });
  const addMetric = (si: number) =>
    updateSection(si, { metrics: [...(cs.sections[si].metrics ?? []), { label: '', value: '' }] });
  const updateMetric = (si: number, mi: number, patch: Partial<{ label: string; value: string }>) =>
    updateSection(si, { metrics: (cs.sections[si].metrics ?? []).map((m, idx) => idx === mi ? { ...m, ...patch } : m) });
  const removeMetric = (si: number, mi: number) =>
    updateSection(si, { metrics: (cs.sections[si].metrics ?? []).filter((_, idx) => idx !== mi) });

  /* ── Gallery helpers ── */
  const addFrame = () =>
    setCs(prev => ({ ...prev, gallery: [...prev.gallery, { src: '', alt: '', label: '' }] }));
  const updateFrame = (i: number, patch: Partial<CaseStudyFrame>) =>
    setCs(prev => ({ ...prev, gallery: prev.gallery.map((g, idx) => idx === i ? { ...g, ...patch } : g) }));
  const removeFrame = (i: number) =>
    setCs(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
  const moveFrame = (i: number, dir: -1 | 1) =>
    setCs(prev => {
      const next = [...prev.gallery];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...prev, gallery: next };
    });

  const handlePicked = (asset: MediaAsset) => {
    if (!picker) return;
    const url = asset.public_url;
    const alt = asset.alt_text ?? asset.file_name;
    if (picker.kind === 'cover') {
      setForm(f => ({ ...f, cover_image: url, cover_image_alt: f.cover_image_alt || alt }));
    } else if (picker.kind === 'section') {
      updateSection(picker.index, { image: url, imageAlt: cs.sections[picker.index]?.imageAlt || alt });
    } else if (picker.kind === 'frame') {
      updateFrame(picker.index, { src: url, alt: cs.gallery[picker.index]?.alt || alt });
    }
    setPicker(null);
  };

  const submit = async (statusOverride?: ContentStatus) => {
    const status = statusOverride ?? form.status;
    if (!form.title.trim()) return toast.error('A title is required');
    if (status !== 'draft' && !publisher) return toast.error('Only admins and editors can publish');

    const slug = (slugTouched && form.slug ? form.slug : slugify(form.title)) || slugify(form.title);
    setSaving(true);
    try {
      const body: CaseStudyBody = {
        badge: cs.badge || 'UI/UX Case Study',
        role: cs.role || '',
        scope: cs.scope || '',
        platform: cs.platform || '',
        behanceUrl: cs.behanceUrl || '',
        sections: cs.sections,
        gallery: cs.gallery,
      };
      const saved = await saveContent({
        type: 'case_study',
        title: form.title.trim(),
        subtitle: form.subtitle || null,
        slug,
        excerpt: form.excerpt || null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        cover_image: form.cover_image || null,
        cover_image_alt: form.cover_image_alt || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        resource_url: cs.behanceUrl || null, // mirror Behance link into resource_url
        status,
        visibility: form.visibility,
        is_featured: form.is_featured,
        publish_date: form.publish_date ? new Date(form.publish_date).toISOString() : (status === 'published' ? new Date().toISOString() : null),
        updated_date: new Date().toISOString(),
        body_json: body,
        reading_time_minutes: reading.minutes,
        word_count: reading.words,
        author_id: access.userId,
        author_name: access.email,
      } as never, isNew ? undefined : id);

      await logAudit({
        event_type: isNew ? 'content.create' : 'content.update',
        target_table: 'content_items',
        target_id: saved.id,
        details: { status, type: 'case_study' },
      });

      qc.invalidateQueries({ queryKey: ['cms'] });
      toast.success(status === 'published' ? 'Published' : 'Saved');
      if (isNew) navigate(`/admin/content/${typePath}/${saved.id}`, { replace: true });
    } catch (e: any) {
      toast.error(e.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/95 backdrop-blur px-4 md:px-8 h-14">
        <button onClick={() => navigate(`/admin/content/${typePath}`)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-muted-foreground">{cs.sections.length} sections · {cs.gallery.length} frames</span>
          <button onClick={() => submit('draft')} disabled={saving} className="px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/70 disabled:opacity-50">
            Save draft
          </button>
          {publisher && (
            <button onClick={() => submit('published')} disabled={saving} className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publish
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8 p-4 md:p-8">
        {/* Main column — hero + sections + gallery */}
        <div className="min-w-0 space-y-10">
          {/* Hero */}
          <section>
            <input
              value={form.title}
              onChange={e => { set('title', e.target.value); if (!slugTouched) set('slug', slugify(e.target.value)); }}
              placeholder="Case study title (e.g. UpTime CMMS)"
              className="w-full bg-transparent text-3xl font-bold outline-none mb-2"
            />
            <input
              value={form.subtitle}
              onChange={e => set('subtitle', e.target.value)}
              placeholder="One-line summary shown under the title"
              className="w-full bg-transparent text-lg text-muted-foreground outline-none mb-5"
            />
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Badge"><input value={cs.badge ?? ''} onChange={e => setCsField('badge', e.target.value)} className={input} placeholder="UI/UX Case Study" /></Field>
              <Field label="Role"><input value={cs.role ?? ''} onChange={e => setCsField('role', e.target.value)} className={input} placeholder="Product Designer (UI/UX)" /></Field>
              <Field label="Scope"><input value={cs.scope ?? ''} onChange={e => setCsField('scope', e.target.value)} className={input} placeholder="End-to-End Design" /></Field>
              <Field label="Platform"><input value={cs.platform ?? ''} onChange={e => setCsField('platform', e.target.value)} className={input} placeholder="Web App (SaaS)" /></Field>
              <div className="sm:col-span-2">
                <Field label="Behance / live URL"><input value={cs.behanceUrl ?? ''} onChange={e => setCsField('behanceUrl', e.target.value)} className={input} placeholder="https://www.behance.net/gallery/…" /></Field>
              </div>
            </div>
          </section>

          {/* Sticky-scroll sections */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Story sections</h2>
                <p className="text-[11px] text-muted-foreground/70">Sticky-scroll storytelling blocks — problem, research, design, outcome.</p>
              </div>
              <button onClick={addSection} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/70">
                <Plus className="w-4 h-4" /> Add section
              </button>
            </div>
            {cs.sections.length === 0 && (
              <p className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">
                No sections yet. Add your first story block.
              </p>
            )}
            <div className="space-y-4">
              {cs.sections.map((s, i) => (
                <div key={i} className="card-elegant p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <GripVertical className="w-3.5 h-3.5" /> Section {i + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label="Move up" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSection(i, 1)} disabled={i === cs.sections.length - 1} aria-label="Move down" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                      <button onClick={() => removeSection(i)} aria-label="Remove section" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Eyebrow"><input value={s.subtitle ?? ''} onChange={e => updateSection(i, { subtitle: e.target.value })} className={input} placeholder="Discovery" /></Field>
                    <Field label="Title"><input value={s.title} onChange={e => updateSection(i, { title: e.target.value })} className={input} placeholder="The Problem" /></Field>
                  </div>
                  <div className="mt-3">
                    {/* div (not <label>) so clicking the toolbar doesn't trigger a button */}
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</span>
                      <div className="mt-1.5">
                        <RichTextField
                          json={s.descriptionJson}
                          text={s.description}
                          placeholder="Describe this part of the story…"
                          onChange={({ json, text }) => updateSection(i, { description: text, descriptionJson: json })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <Field label="Image">
                      <ImageField value={s.image} alt={s.imageAlt}
                        onPick={() => setPicker({ kind: 'section', index: i })}
                        onClear={() => updateSection(i, { image: '' })}
                        onManualUrl={url => updateSection(i, { image: url })} />
                    </Field>
                    <Field label="Image alt text"><input value={s.imageAlt ?? ''} onChange={e => updateSection(i, { imageAlt: e.target.value })} className={input} /></Field>
                  </div>
                  {/* Metrics */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Metrics (optional)</span>
                      <button onClick={() => addMetric(i)} className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    <div className="space-y-2">
                      {(s.metrics ?? []).map((m, mi) => (
                        <div key={mi} className="flex gap-2 items-center">
                          <input value={m.value} onChange={e => updateMetric(i, mi, { value: e.target.value })} placeholder="94%" className={`${input} w-24`} />
                          <input value={m.label} onChange={e => updateMetric(i, mi, { label: e.target.value })} placeholder="Task completion" className={input} />
                          <button onClick={() => removeMetric(i, mi)} aria-label="Remove metric" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery frames */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Full-frame gallery</h2>
                <p className="text-[11px] text-muted-foreground/70">Every frame of the case study, shown in order with a lightbox.</p>
              </div>
              <button onClick={addFrame} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-sm hover:bg-secondary/70">
                <Plus className="w-4 h-4" /> Add frame
              </button>
            </div>
            {cs.gallery.length === 0 && (
              <p className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-6 text-center">
                No frames yet. Add images to build the gallery.
              </p>
            )}
            <div className="space-y-3">
              {cs.gallery.map((g, i) => (
                <div key={i} className="card-elegant p-4 grid sm:grid-cols-[120px_1fr_auto] gap-4 items-start">
                  <div>
                    {g.src
                      ? <img src={g.src} alt={g.alt || `Frame ${i + 1}`} className="w-full rounded-lg border border-border" />
                      : <div className="aspect-[4/3] rounded-lg border border-dashed border-border grid place-items-center text-muted-foreground"><ImagePlus className="w-5 h-5" /></div>}
                    <button onClick={() => setPicker({ kind: 'frame', index: i })} className="mt-2 w-full text-xs px-2 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground">Choose image</button>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <input value={g.src} onChange={e => updateFrame(i, { src: e.target.value })} placeholder="Image URL" className={input} />
                    <input value={g.label ?? ''} onChange={e => updateFrame(i, { label: e.target.value })} placeholder="Label (e.g. Dashboard)" className={input} />
                    <input value={g.alt ?? ''} onChange={e => updateFrame(i, { alt: e.target.value })} placeholder="Alt text" className={input} />
                  </div>
                  <div className="flex sm:flex-col gap-1">
                    <button onClick={() => moveFrame(i, -1)} disabled={i === 0} aria-label="Move up" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveFrame(i, 1)} disabled={i === cs.gallery.length - 1} aria-label="Move down" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => removeFrame(i)} aria-label="Remove frame" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar — meta */}
        <aside className="space-y-4">
          <Field label="Slug">
            <input value={form.slug} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} className={input} />
          </Field>
          <Field label="Excerpt" hint="Short summary for the projects listing & SEO.">
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={3} className={input} />
          </Field>
          <Field label="Tags (comma separated)">
            <input value={form.tags} onChange={e => set('tags', e.target.value)} className={input} placeholder="UI/UX, SaaS, Dashboard" />
          </Field>
          <Field label="Cover image" hint="Thumbnail on the Projects page.">
            <ImageField value={form.cover_image} alt={form.cover_image_alt}
              onPick={() => setPicker({ kind: 'cover' })}
              onClear={() => set('cover_image', '')}
              onManualUrl={url => set('cover_image', url)} />
          </Field>
          <Field label="Cover image alt text">
            <input value={form.cover_image_alt} onChange={e => set('cover_image_alt', e.target.value)} className={input} />
          </Field>
          <Field label="SEO title">
            <input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className={input} />
          </Field>
          <Field label="SEO description">
            <textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)} rows={2} className={input} />
          </Field>
          <Field label="Publish date">
            <input type="date" value={form.publish_date} onChange={e => set('publish_date', e.target.value)} className={input} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set('status', e.target.value)} className={input} disabled={!publisher}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Visibility">
            <select value={form.visibility} onChange={e => set('visibility', e.target.value)} className={input}>
              {VISIBILITIES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Featured on Projects page
          </label>
          {!publisher && (
            <p className="text-xs text-muted-foreground">Your role can draft content. An admin or editor publishes it.</p>
          )}
        </aside>
      </div>

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={handlePicked}
        title={picker?.kind === 'cover' ? 'Choose a cover image' : 'Choose an image'}
      />
    </AdminLayout>
  );
};

export default CaseStudyEditor;

// Route guard: this editor only handles the case_study type.
export const CaseStudyEditorRoute = () => {
  const { typePath } = useParams();
  if (typePath !== 'case-studies') return <Navigate to="/admin" replace />;
  return <CaseStudyEditor />;
};
