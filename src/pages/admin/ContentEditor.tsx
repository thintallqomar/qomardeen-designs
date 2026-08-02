import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canPublish } from '@/lib/roles';
import {
  fetchById, saveContent, slugify, estimateReading, pathToType, logAudit,
  type ContentStatus, type ContentVisibility,
} from '@/lib/cms';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const STATUSES: ContentStatus[] = ['draft', 'published', 'scheduled', 'archived'];
const VISIBILITIES: ContentVisibility[] = ['public', 'unlisted', 'private'];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const input = 'w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary';

const ContentEditor = () => {
  const { typePath = 'articles', id } = useParams();
  const type = pathToType(typePath);
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
    title: '', subtitle: '', slug: '', excerpt: '', tldr: '', category: '',
    tags: '', cover_image: '', cover_image_alt: '', seo_title: '', seo_description: '',
    resource_url: '', status: 'draft' as ContentStatus, visibility: 'public' as ContentVisibility,
    is_featured: false, is_pinned: false, publish_date: '',
  });
  const [body, setBody] = useState<{ json: unknown; html: string; text: string }>({ json: null, html: '', text: '' });
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setForm({
      title: existing.title, subtitle: existing.subtitle ?? '', slug: existing.slug,
      excerpt: existing.excerpt ?? '', tldr: existing.tldr ?? '', category: existing.category ?? '',
      tags: (existing.tags ?? []).join(', '), cover_image: existing.cover_image ?? '',
      cover_image_alt: existing.cover_image_alt ?? '', seo_title: existing.seo_title ?? '',
      seo_description: existing.seo_description ?? '', resource_url: existing.resource_url ?? '',
      status: existing.status, visibility: existing.visibility,
      is_featured: existing.is_featured, is_pinned: existing.is_pinned,
      publish_date: existing.publish_date ? existing.publish_date.slice(0, 10) : '',
    });
    setBody({ json: existing.body_json, html: existing.body_html ?? '', text: '' });
    setSlugTouched(true);
  }, [existing]);

  const reading = useMemo(() => estimateReading(body.text || form.excerpt), [body.text, form.excerpt]);
  const publisher = canPublish(access);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  if (!type) return <Navigate to="/admin" replace />;

  const submit = async (statusOverride?: ContentStatus) => {
    const status = statusOverride ?? form.status;
    if (!form.title.trim()) return toast.error('A title is required');
    if (status !== 'draft' && !publisher) return toast.error('Only admins and editors can publish');

    const slug = (slugTouched && form.slug ? form.slug : slugify(form.title)) || slugify(form.title);
    setSaving(true);
    try {
      const saved = await saveContent({
        type,
        title: form.title.trim(),
        subtitle: form.subtitle || null,
        slug,
        excerpt: form.excerpt || null,
        tldr: form.tldr || null,
        category: form.category || null,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        cover_image: form.cover_image || null,
        cover_image_alt: form.cover_image_alt || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        resource_url: form.resource_url || null,
        status,
        visibility: form.visibility,
        is_featured: form.is_featured,
        is_pinned: form.is_pinned,
        publish_date: form.publish_date ? new Date(form.publish_date).toISOString() : (status === 'published' ? new Date().toISOString() : null),
        updated_date: new Date().toISOString(),
        body_json: body.json,
        body_html: body.html || null,
        reading_time_minutes: reading.minutes,
        word_count: reading.words,
        author_id: access.userId,
        author_name: access.email,
      } as never, isNew ? undefined : id);

      await logAudit({
        event_type: isNew ? 'content.create' : 'content.update',
        target_table: 'content_items',
        target_id: saved.id,
        details: { status, type },
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
          <span className="hidden sm:inline text-xs text-muted-foreground">{reading.words} words · {reading.minutes} min</span>
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

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 p-4 md:p-8">
        <div className="min-w-0">
          <input
            value={form.title}
            onChange={e => { set('title', e.target.value); if (!slugTouched) set('slug', slugify(e.target.value)); }}
            placeholder="Title"
            className="w-full bg-transparent text-3xl font-bold outline-none mb-2"
          />
          <input
            value={form.subtitle}
            onChange={e => set('subtitle', e.target.value)}
            placeholder="Subtitle"
            className="w-full bg-transparent text-lg text-muted-foreground outline-none mb-5"
          />
          <TiptapEditor content={body.json} onChange={setBody} />
        </div>

        <aside className="space-y-4">
          <Field label="Slug">
            <input value={form.slug} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} className={input} />
          </Field>
          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={3} className={input} />
          </Field>
          <Field label="TL;DR">
            <textarea value={form.tldr} onChange={e => set('tldr', e.target.value)} rows={2} className={input} />
          </Field>
          <Field label="Category">
            <input value={form.category} onChange={e => set('category', e.target.value)} className={input} />
          </Field>
          <Field label="Tags (comma separated)">
            <input value={form.tags} onChange={e => set('tags', e.target.value)} className={input} />
          </Field>
          <Field label="Cover image URL">
            <input value={form.cover_image} onChange={e => set('cover_image', e.target.value)} className={input} />
          </Field>
          <Field label="Cover image alt text">
            <input value={form.cover_image_alt} onChange={e => set('cover_image_alt', e.target.value)} className={input} />
          </Field>
          {type === 'resource' && (
            <Field label="Download URL">
              <input value={form.resource_url} onChange={e => set('resource_url', e.target.value)} className={input} />
            </Field>
          )}
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
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.is_pinned} onChange={e => set('is_pinned', e.target.checked)} /> Pinned
            </label>
          </div>
          {!publisher && (
            <p className="text-xs text-muted-foreground">
              Your role can draft content. An admin or editor publishes it.
            </p>
          )}
        </aside>
      </div>
    </AdminLayout>
  );
};

export default ContentEditor;
