import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, ImagePlus, Loader2, RotateCcw, Download, Check } from 'lucide-react';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canPublish } from '@/lib/roles';
import { uploadMedia, uploadDocument, formatBytes, MAX_UPLOAD_BYTES, MAX_DOC_BYTES } from '@/lib/media';
import {
  fetchSiteSettings, saveSiteSetting, saveSiteValue, clearSiteSetting, heroStyleOf, nowLineOf, atlasNotesOf,
  atlasConfigOf, atlasConfigValue, ATLAS_IDLE_CHOICES, footerScenesOf, type AtlasConfig,
  type SiteKey, type SiteSetting, type HeroStyle,
} from '@/lib/siteSettings';
import { downloadCv } from '@/lib/cv';
import { errorMessage } from '@/lib/errorMessage';
import heroPortrait from '@/assets/split-designer.webp';
import { Switch } from '@/components/ui/switch';

const FADE =
  '[mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,black_38%,rgba(0,0,0,0.55)_75%,transparent_100%)]';

/** True when the image's edges are mostly transparent, i.e. a cut-out portrait. */
async function isCutout(file: File): Promise<boolean> {
  if (!/png|webp|avif/.test(file.type)) return false;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = url; });
    const c = document.createElement('canvas'); c.width = 64; c.height = 64;
    const ctx = c.getContext('2d')!; ctx.drawImage(img, 0, 0, 64, 64);
    const d = ctx.getImageData(0, 0, 64, 64).data;
    let clear = 0, total = 0;
    for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
      if (y > 3 && x > 3 && x < 60) continue; // only the top rows and side columns
      total++; if (d[(y * 64 + x) * 4 + 3] < 16) clear++;
    }
    return clear / total > 0.6;
  } catch { return false; } finally { URL.revokeObjectURL(url); }
}

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
                {current.size ? ` · ${formatBytes(current.size)}` : ''}{current.cutout ? ' · cut-out' : ''} · {when(current.updatedAt)}
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

const HeroControls = ({
  style, nowLine, busy, onStyle, onNow,
}: { style: HeroStyle; nowLine: string; busy: boolean; onStyle: (s: HeroStyle) => void; onNow: (v: string) => void }) => {
  const [draft, setDraft] = useState(nowLine);
  const options: { value: HeroStyle; title: string; body: string }[] = [
    { value: 'new', title: 'Designer | Builder split (new)', body: 'Your name, your face split into designer and code halves that follow the mouse, and Ask Atlas prompts. No intro section; the CV lives on Hire and About.' },
    { value: 'classic', title: 'Classic', body: 'The previous hero with your name as the headline, the Hire me | CV button, skill tags and the intro section.' },
  ];
  return (
    <section className="card-elegant p-5 md:p-6">
      <h2 className="text-lg font-semibold">Home hero</h2>
      <p className="text-sm text-muted-foreground mt-1">Switch between the two hero designs at any time. Nothing is deleted either way.</p>
      <div role="radiogroup" aria-label="Hero style" className="mt-4 grid sm:grid-cols-2 gap-3">
        {options.map(o => {
          const active = style === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={busy}
              onClick={() => !active && onStyle(o.value)}
              className={`text-left rounded-xl border p-3.5 transition-colors disabled:opacity-60 ${active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-secondary hover:border-primary/40'}`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className={`w-3.5 h-3.5 rounded-full border-2 ${active ? 'border-primary bg-primary' : 'border-muted-foreground/50'}`} />
                {o.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-1 pl-[1.375rem]">{o.body}</span>
            </button>
          );
        })}
      </div>
      <label className="block mt-5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Now line (optional, new hero only)</span>
        <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
          <input
            value={draft}
            maxLength={90}
            onChange={e => setDraft(e.target.value)}
            placeholder="Studying computer science at UoPeople"
            className="flex-1 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            disabled={busy || draft.trim() === nowLine}
            onClick={() => onNow(draft.trim())}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
          </button>
        </div>
        <span className="block text-xs text-muted-foreground mt-1.5">A short, true line about what you are doing now. Leave it empty to hide it.</span>
      </label>
    </section>
  );
};

/** Extra facts for Atlas, the site's AI guide. Atlas trusts these over older facts. */
const AtlasSwitch = ({ config, busy, onChange }: { config: AtlasConfig; busy: boolean; onChange: (c: AtlasConfig) => void }) => (
  <section className="card-elegant p-5 md:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">Atlas, the AI guide</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {config.enabled
            ? 'On: visitors see the Ask Atlas button and the Atlas prompts on Home.'
            : 'Off: Atlas is hidden from visitors. You can still use it inside the admin.'}
        </p>
      </div>
      <label className={`flex items-center gap-2 shrink-0 ${busy ? 'opacity-50' : 'cursor-pointer'}`}>
        <span className={`w-6 text-right text-xs font-medium ${config.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{config.enabled ? 'On' : 'Off'}</span>
        <Switch
          checked={config.enabled}
          disabled={busy}
          onCheckedChange={on => onChange({ ...config, enabled: on })}
          aria-label="Show Atlas on the site"
        />
      </label>
    </div>
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-sm font-medium">Close the chat when nobody is using it</p>
      <p className="text-xs text-muted-foreground mt-0.5">Counts from the visitor's last tap, scroll or keypress. Longer answers get extra reading time, and it never closes while Atlas is answering or the visitor is typing.</p>
      <div role="radiogroup" aria-label="Close after" className="mt-3 flex flex-wrap gap-2">
        {ATLAS_IDLE_CHOICES.map(sec => {
          const on = config.idleSeconds === sec;
          return (
            <button
              key={sec}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={busy || !config.enabled}
              onClick={() => onChange({ ...config, idleSeconds: sec })}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:opacity-50 ${on ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-secondary'}`}
            >
              {sec === 0 ? 'Never' : `After ${sec} seconds`}
            </button>
          );
        })}
      </div>
    </div>
  </section>
);

const FooterScenesSwitch = ({ on, busy, onChange }: { on: boolean; busy: boolean; onChange: (on: boolean) => void }) => (
  <section className="card-elegant p-5 md:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">Footer scenery</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {on
            ? 'On: faded scenes inspired by your favourite games (a neon coast, a frontier at dusk, a moonlit field, a city at night) take turns behind the footer on every page.'
            : 'Off: the footer shows no scenery.'}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">Visitors who turn on reduced motion see one still scene.</p>
      </div>
      <label className={`flex items-center gap-2 shrink-0 ${busy ? 'opacity-50' : 'cursor-pointer'}`}>
        <span className={`w-6 text-right text-xs font-medium ${on ? 'text-foreground' : 'text-muted-foreground'}`}>{on ? 'On' : 'Off'}</span>
        <Switch checked={on} disabled={busy} onCheckedChange={onChange} aria-label="Show scenery behind the footer" />
      </label>
    </div>
  </section>
);

const AtlasNotes = ({ value, busy, onSave }: { value: string; busy: boolean; onSave: (v: string) => void }) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <section className="card-elegant p-5 md:p-6">
      <h2 className="text-lg font-semibold">Notes for Atlas</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Atlas already knows your About, Hire and case study pages, everything you publish here, and how the site was built.
        Add anything else you want it to know: a new role, a recent project, what you're learning, how you like to work.
        Write plain facts, one per line. Atlas will say it doesn't know rather than guess.
      </p>
      <label className="block mt-4">
        <span className="sr-only">Notes for Atlas</span>
        <textarea
          value={draft}
          maxLength={6000}
          rows={8}
          onChange={e => setDraft(e.target.value)}
          placeholder={'Started a contract with … in December 2026.\nCurrently learning motion design in Figma.\nPrefers async collaboration and weekly demos.'}
          className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </label>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{draft.length.toLocaleString()} / 6,000 · Visitors can see anything Atlas knows, so don't add private details.</span>
        <button
          type="button"
          disabled={busy || draft.trim() === value.trim()}
          onClick={() => onSave(draft.trim())}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save notes
        </button>
      </div>
    </section>
  );
};

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
      const cutout = await isCutout(file);
      const asset = await uploadMedia(file, 'site', label);
      await saveSiteSetting(key, { url: asset.public_url, fileName: file.name, size: asset.file_size, mime: asset.mime_type, cutout }, author);
      toast.success(`${label} updated${cutout ? ' (cut-out detected: shown in the arch)' : ''}. Visitors see it within a few minutes.`);
      refresh();
    } catch (e) {
      toast.error(errorMessage(e, 'Upload failed'), { duration: 12000 });
    } finally {
      setBusy(null);
    }
  };

  const uploadCv = async (file: File) => {
    setBusy('cv');
    try {
      // Two steps, labelled, so a failure says which one broke.
      const doc = await uploadDocument(file, 'site').catch(e => { throw new Error(`Saving the file failed: ${errorMessage(e)}`); });
      await saveSiteSetting('cv', { url: doc.url, fileName: file.name, size: doc.size, mime: 'application/pdf' }, author)
        .catch(e => { throw new Error(`The file uploaded, but switching the site to it failed: ${errorMessage(e)}`); });
      toast.success('CV updated. The CV buttons now use this file.');
      refresh();
    } catch (e) {
      toast.error(errorMessage(e, 'Upload failed'), { duration: 12000 });
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
      toast.error(errorMessage(e, 'Could not reset'), { duration: 12000 });
    } finally {
      setBusy(null);
    }
  };

  const saveValue = async (key: SiteKey, value: string, done: string) => {
    setBusy(key);
    try {
      if (value) await saveSiteValue(key, value, author);
      else await clearSiteSetting(key);
      toast.success(done);
      refresh();
    } catch (e) {
      toast.error(errorMessage(e, 'Could not save'), { duration: 12000 });
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />;

  return (
    <div className="space-y-6">
      <HeroControls
        style={heroStyleOf(settings)}
        nowLine={nowLineOf(settings)}
        busy={busy === 'heroStyle' || busy === 'nowLine'}
        onStyle={st => saveValue('heroStyle', st === 'classic' ? 'classic' : '', st === 'classic' ? 'Home now uses the classic hero.' : 'Home now uses the new hero.')}
        onNow={v => saveValue('nowLine', v, v ? 'Now line saved.' : 'Now line removed.')}
      />
      <AtlasSwitch
        config={atlasConfigOf(settings)}
        busy={busy === 'atlas'}
        onChange={c => saveValue('atlas', atlasConfigValue(c), c.enabled ? (c.idleSeconds ? `Atlas is on and closes after ${c.idleSeconds} seconds without activity.` : 'Atlas is on and stays open until closed.') : 'Atlas is off for visitors.')}
      />
      <FooterScenesSwitch
        on={footerScenesOf(settings)}
        busy={busy === 'footerScenes'}
        onChange={on => saveValue('footerScenes', on ? '' : 'off', on ? 'Footer scenery is on.' : 'Footer scenery is off.')}
      />
      <AtlasNotes
        value={atlasNotesOf(settings)}
        busy={busy === 'atlasNotes'}
        onSave={v => saveValue('atlasNotes', v, v ? 'Atlas will use these notes from its next answer.' : 'Notes for Atlas removed.')}
      />
      {isError && (
        <p className="text-sm text-destructive">Could not load the current files. You can still upload; refresh the page to see their status.</p>
      )}

      <SettingCard
        title="Home hero image"
        description="The portrait next to your name on the Home page."
        tips={[
          'Portrait works best, about 4:5 (for example 1200 × 1500 px), face in the upper half.',
          'Uploading a photo here replaces the designer/builder split with your photo (edges fade into the page). Use "Use built-in" to bring the split back.',
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
