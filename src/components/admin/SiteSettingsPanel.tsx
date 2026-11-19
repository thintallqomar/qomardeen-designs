import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, ImagePlus, Loader2, RotateCcw, Download } from 'lucide-react';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canPublish } from '@/lib/roles';
import { uploadMedia, uploadDocument, formatBytes, MAX_UPLOAD_BYTES, MAX_DOC_BYTES } from '@/lib/media';
import { fetchSiteSettings, saveSiteSetting, clearSiteSetting, type SiteKey, type SiteSetting } from '@/lib/siteSettings';
import { downloadCv } from '@/lib/cv';
import heroPortrait from '@/assets/hero-portrait-hq.png';

const FADE =
  '[mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)]';

const when = (iso?: string) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

interface CardProps {
  title: string;
  description: string;
  tips: string[];
  current?: SiteSetting;
  defaultLabel: string;
  busy: boolean;
  accept: string;
  uploadLabel: string;
  onFile: (file: File) => void;
  onReset: () => void;
  preview: React.ReactNode;
  extra?: React.ReactNode;
}

const SettingCard = ({ title, description, tips, current, defaultLabel, busy, accept, uploadLabel, onFile, onReset, preview, extra }: CardProps) => {
  const input = useRef<HTMLInputElement>(null);
  return (
    <section className="card-elegant p-5 md:p-6">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="shrink-0">{preview}</div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">Currently: </span>
            {current ? (
              <span className="font-medium">
                Uploaded · <span className="break-all">{current.fileName || 'file'}</span>
                {current.size ? ` · ${formatBytes(current.size)}` : ''} · {when(current.updatedAt)}
              </span>
            ) : (
              <span className="font-medium">{defaultLabel}</span>
            )}
          </p>

          <ul className="mt-3 space-y-1 text-xs text-muted-foreground list-disc pl-4">
            {tips.map(t => <li key={t}>{t}</li>)}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              ref={input}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={e => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) onFile(f);
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => input.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
              {busy ? 'Uploading…' : current ? `Replace ${uploadLabel}` : `Upload ${uploadLabel}`}
            </button>
            {current && (
              <button
                type="button"
                disabled={busy}
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" /> Use built-in
              </button>
            )}
            {extra}
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroPreview = ({ src }: { src: string }) => (
  <div className={`relative w-40 aspect-[4/5] overflow-hidden ${FADE}`}>
    <img src={src} alt="" className="w-full h-full object-cover object-center" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
  </div>
);

const SiteSettingsPanel = () => {
  const access = useStaffAuth();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<SiteKey | null>(null);
  const { data: settings = {}, isLoading, isError } = useQuery({
    queryKey: ['site-settings-admin'],
    queryFn: fetchSiteSettings,
    retry: false,
  });

  if (access.loading) return <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
  if (!canPublish(access)) {
    return <p className="text-sm text-muted-foreground">Only an owner or admin can change these site files.</p>;
  }

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['site-settings-admin'] });
    qc.invalidateQueries({ queryKey: ['site-settings'] });
  };

  const author = { userId: access.userId, email: access.email };

  const uploadImage = async (key: SiteKey, label: string, file: File) => {
    setBusy(key);
    try {
      const asset = await uploadMedia(file, 'site', label);
      await saveSiteSetting(key, { url: asset.public_url, fileName: file.name, size: asset.file_size, mime: asset.mime_type }, author);
      toast.success(`${label} updated. Visitors see it within a few minutes.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(null);
    }
  };

  const uploadCv = async (file: File) => {
    setBusy('cv');
    try {
      const doc = await uploadDocument(file, 'site');
      await saveSiteSetting('cv', { url: doc.url, fileName: file.name, size: doc.size, mime: 'application/pdf' }, author);
      toast.success('CV updated. The CV buttons now use this file.');
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(null);
    }
  };

  const reset = async (key: SiteKey, label: string) => {
    if (!window.confirm(`Go back to the built-in ${label}? The uploaded file stays in the media library.`)) return;
    setBusy(key);
    try {
      await clearSiteSetting(key);
      toast.success(`${label} reset to the built-in one.`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not reset');
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />;

  return (
    <div className="space-y-6">
      {isError && (
        <p className="text-sm text-destructive">Could not load the current files. You can still upload; refresh the page to see their status.</p>
      )}

      <SettingCard
        title="Home hero image"
        description="The portrait next to your name on the Home page."
        tips={[
          'Portrait works best, about 4:5 (for example 1200 × 1500 px), face in the upper half.',
          'A plain or white background blends into the page best: the edges fade out automatically.',
          `JPG, PNG or WebP up to ${formatBytes(MAX_UPLOAD_BYTES)}. It is compressed to WebP for you.`,
        ]}
        current={settings.homeHero}
        defaultLabel="the built-in photo"
        busy={busy === 'homeHero'}
        accept="image/png,image/jpeg,image/webp"
        uploadLabel="image"
        onFile={f => uploadImage('homeHero', 'Home hero image', f)}
        onReset={() => reset('homeHero', 'Home hero image')}
        preview={<HeroPreview src={settings.homeHero?.url ?? heroPortrait} />}
      />

      <SettingCard
        title="Hire hero image"
        description="The portrait on the Hire page. If you do not upload one here, it uses the Home hero image."
        tips={[
          'Same advice as the Home image. Use a different photo if you want Hire to feel more formal or more casual.',
          `JPG, PNG or WebP up to ${formatBytes(MAX_UPLOAD_BYTES)}.`,
        ]}
        current={settings.hireHero}
        defaultLabel={settings.homeHero ? 'the Home hero image' : 'the built-in photo'}
        busy={busy === 'hireHero'}
        accept="image/png,image/jpeg,image/webp"
        uploadLabel="image"
        onFile={f => uploadImage('hireHero', 'Hire hero image', f)}
        onReset={() => reset('hireHero', 'Hire hero image')}
        preview={<HeroPreview src={settings.hireHero?.url ?? settings.homeHero?.url ?? heroPortrait} />}
      />

      <SettingCard
        title="CV"
        description="Every CV and resume button on the site (Home, About, Hire and the CV viewer) downloads this file."
        tips={[
          `PDF only, up to ${formatBytes(MAX_DOC_BYTES)}.`,
          'Visitors receive it as Qomardeen_Tijani_CV.pdf, whatever the file is called here.',
          'After uploading, press "Test download" to check it opens.',
        ]}
        current={settings.cv}
        defaultLabel="the built-in CV"
        busy={busy === 'cv'}
        accept="application/pdf"
        uploadLabel="PDF"
        onFile={uploadCv}
        onReset={() => reset('cv', 'CV')}
        preview={
          <div className="w-40 aspect-[4/5] rounded-xl border border-border bg-secondary flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileText className="w-10 h-10" />
            <span className="text-xs">PDF</span>
          </div>
        }
        extra={
          <button
            type="button"
            onClick={async () => { if (!(await downloadCv())) toast.error('The CV could not be downloaded.'); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary"
          >
            <Download className="w-4 h-4" /> Test download
          </button>
        }
      />
    </div>
  );
};

export default SiteSettingsPanel;
