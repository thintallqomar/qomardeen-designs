import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import ReadingProgress from '@/components/ReadingProgress';
import FloatingBackButton from '@/components/FloatingBackButton';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ImageViewer from '@/components/ImageViewer';
import ScrollReveal from '@/components/ScrollReveal';
import RollingNumber from '@/components/RollingNumber';
import StickyScrollSection from '@/components/StickyScrollSection';
import CaseVideo from '@/components/caseStudy/CaseVideo';
import { CaseStudyHeader, CaseStudyFrames, CaseStudyEnd, type Fact } from '@/components/caseStudy/CaseStudyParts';
import { safeHref } from '@/lib/safeUrl';
import { projectKind, type CaseStudyBlock, type CaseStudyBody } from '@/lib/cms';

export interface CaseStudyViewProps {
  slug: string;
  title: string;
  lead?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  body: CaseStudyBody;
}

const Num = ({ n }: { n: number }) => (
  <span className="font-mono text-sm text-primary tabular-nums">{String(n).padStart(2, '0')}</span>
);

/** One extra section (results, decisions, how it was built…), drawn the same way on every case study. */
const Block = ({ block, onOpenImage }: { block: CaseStudyBlock; onOpenImage: (src: string) => void }) => {
  const tone = block.tone === 'muted' ? 'bg-muted/30' : '';
  const intro = block.intro ? <p className="text-muted-foreground max-w-2xl mb-8">{block.intro}</p> : null;

  if (block.type === 'stats') {
    return (
      <section className={`section-padding ${tone}`}>
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="t-h2 mb-3">{block.title}</h2>
            {block.intro && <p className="text-muted-foreground max-w-2xl mb-10">{block.intro}</p>}
          </ScrollReveal>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-8">
            {block.items.map(r => (
              <div key={r.label} className="border-t border-border py-5">
                <dt className="sr-only">{r.label}</dt>
                <dd>
                  <span className="block text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tighter leading-none">
                    <RollingNumber value={Number(r.value) || 0} />{r.suffix && <span className="text-primary">{r.suffix}</span>}
                  </span>
                  <span className="mt-3 block text-sm text-muted-foreground" aria-hidden="true">{r.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  if (block.type === 'list') {
    const Tag = block.numbered === false ? 'ul' : 'ol';
    return (
      <section className={`section-padding ${tone}`}>
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="t-h2 mb-3">{block.title}</h2>
            {intro}
          </ScrollReveal>
          <Tag>
            {block.items.map((d, i) => (
              <li key={`${d.title}-${i}`} className="grid md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-8 gap-y-2 border-t border-border py-6">
                <span className="pt-1">{block.numbered !== false && <Num n={i + 1} />}</span>
                <div>
                  <h3 className="t-h3 mb-2">{d.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{d.body}</p>
                </div>
                {d.aside ? (
                  <p className="text-sm text-muted-foreground leading-relaxed md:pt-1">
                    {block.asideLabel && <span className="block text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-1.5">{block.asideLabel}</span>}
                    {d.aside}
                  </p>
                ) : <span />}
              </li>
            ))}
          </Tag>
        </div>
      </section>
    );
  }

  if (block.type === 'feature') {
    return (
      <section className={`section-padding ${tone}`}>
        <div className="container-custom">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-14 lg:items-start">
            <ScrollReveal>
              <h2 className="t-h2 mb-3">{block.title}</h2>
              {block.intro && <p className="text-muted-foreground leading-relaxed max-w-xl">{block.intro}</p>}
              <ul className="mt-6">
                {block.items.map(w => (
                  <li key={w.title} className="border-t border-border py-4">
                    <h3 className="t-h3 mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            {block.image && (
              <ScrollReveal delay={0.1}>
                <button
                  type="button"
                  onClick={() => onOpenImage(block.zoomImage || block.image!)}
                  className="block w-full overflow-hidden rounded-2xl border border-border bg-card cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`${block.imageAlt || block.title}: open full screen`}
                >
                  <img src={block.image} alt={block.imageAlt || ''} loading="lazy" decoding="async" className="w-full h-auto" />
                </button>
                {block.caption && <p className="mt-3 text-sm text-muted-foreground">{block.caption}</p>}
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (block.type === 'steps') {
    return (
      <section className={`section-padding ${tone}`}>
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="t-h2 mb-3">{block.title}</h2>
            {block.intro && <p className="text-muted-foreground max-w-2xl mb-10">{block.intro}</p>}
          </ScrollReveal>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {block.items.map((w, i) => (
              <li key={`${w.title}-${i}`} className="border-t border-border py-5">
                <Num n={i + 1} />
                <h3 className="t-h3 mt-2 mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
              </li>
            ))}
          </ol>
          {!!block.columns?.length && (
            <div className="mt-10 grid md:grid-cols-2 gap-x-8">
              {block.columns.map(col => (
                <div key={col.title} className="border-t border-border pt-5 pb-2">
                  <h3 className="t-h3 mb-4">{col.title}</h3>
                  <ul className="space-y-3">
                    {col.items.map(it => (
                      <li key={it} className="flex gap-3 text-[15px] leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // bullets
  return (
    <section className={`pb-16 md:pb-24 ${tone}`}>
      <div className="container-custom">
        <ScrollReveal>
          <h2 className="t-h2 mb-6">{block.title}</h2>
          {block.intro && <p className="text-muted-foreground max-w-2xl mb-6">{block.intro}</p>}
          <ol className="max-w-2xl">
            {block.items.map((n, i) => (
              <li key={`${n}-${i}`} className="flex gap-4 border-t border-border py-4">
                <span className="pt-0.5"><Num n={i + 1} /></span>
                <span>{n}</span>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  );
};

/**
 * The whole case study page. Used by admin-made case studies and by the built-in ones,
 * so an imported copy looks exactly like the original.
 */
const CaseStudyView = ({ slug, title, lead, seoTitle, seoDescription, seoImage, body }: CaseStudyViewProps) => {
  const { t } = useTranslation();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const sections = Array.isArray(body.sections) ? body.sections.filter(s => s.image || s.video) : [];
  const gallery = Array.isArray(body.gallery) ? body.gallery.filter(g => g.src) : [];
  const blocks = Array.isArray(body.blocks) ? body.blocks : [];
  const isOther = projectKind(body) === 'other';
  const liveUrl = body.behanceUrl || '';
  const proto = body.prototype;
  const protoUrl = safeHref(proto?.url);

  const frames = gallery.map((g, i) => ({ src: g.src, alt: g.alt || g.label || `Frame ${i + 1}`, label: g.label, video: g.video }));
  // Images that can open full screen: every frame, plus block images that aren't frames already.
  const viewerImages = useMemo(() => {
    const list = frames.map(f => ({ src: f.src, alt: f.alt }));
    for (const b of blocks) {
      if (b.type !== 'feature') continue;
      const src = b.zoomImage || b.image;
      if (src && !list.some(l => l.src === src)) list.push({ src, alt: b.imageAlt || b.title });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery, blocks]);
  const openViewer = (i: number) => { setViewerIndex(i); setViewerOpen(true); };
  const openImage = (src: string) => {
    // A block image opens the matching frame when there is one (e.g. the admin screenshots).
    const frameIdx = frames.findIndex(f => f.src === src);
    const idx = frameIdx >= 0 ? frameIdx : viewerImages.findIndex(v => v.src === src);
    openViewer(Math.max(0, idx));
  };

  const facts: Fact[] = body.facts?.length
    ? body.facts.map(f => ({ label: f.labelKey ? t(`caseStudy.${f.labelKey}`) : f.label, value: f.value }))
    : [
      { label: t('caseStudy.role'), value: body.role || '' },
      { label: t('caseStudy.scope'), value: body.scope || '' },
      { label: t('caseStudy.platform'), value: body.platform || '' },
      { label: t('caseStudy.timeline'), value: body.timeline || '' },
    ];

  const before = blocks.filter(b => b.placement !== 'afterFrames');
  const after = blocks.filter(b => b.placement === 'afterFrames');

  return (
    <>
      <Navigation />
      <PageSEO
        title={seoTitle || `${title} — Qomardeen Tijani`}
        description={seoDescription || lead || ''}
        path={`/projects/${slug}`}
        image={seoImage}
      />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />
          <FloatingBackButton />

          <main className="pt-14">
            <CaseStudyHeader
              badge={body.badge}
              title={title}
              lead={lead}
              facts={facts}
              liveUrl={liveUrl || undefined}
              liveLabel={body.liveLabel || undefined}
            />

            {sections.length > 0 && (
              <StickyScrollSection
                items={sections.map(s => ({
                  title: s.title,
                  subtitle: s.subtitle,
                  description: s.description,
                  descriptionJson: s.descriptionJson,
                  image: s.image,
                  imageAlt: s.imageAlt || s.title,
                  video: s.video || undefined,
                  metrics: s.metrics,
                }))}
              />
            )}

            {proto && (proto.video || protoUrl) && (
              <section className="section-padding bg-muted/30">
                <div className="container-custom">
                  <ScrollReveal>
                    <div className="mb-8 max-w-2xl">
                      <h2 className="t-h2 mb-3">{proto.title || 'The prototype, tap by tap'}</h2>
                      {proto.description && <p className="text-muted-foreground">{proto.description}</p>}
                    </div>
                  </ScrollReveal>
                  {proto.video && <CaseVideo src={proto.video} poster={proto.poster} label={`${proto.title || 'Prototype'}: walkthrough`} />}
                  {protoUrl && (
                    <a href={protoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6 inline-flex">
                      <ExternalLink className="w-4 h-4" /> {proto.buttonLabel || 'Try it yourself in Figma'}
                    </a>
                  )}
                </div>
              </section>
            )}

            {before.map((b, i) => <Block key={`b-${i}`} block={b} onOpenImage={openImage} />)}

            {frames.length > 0 && (
              <CaseStudyFrames
                title={body.framesTitle || (isOther ? t('caseStudy.framesTitle') : t('caseStudy.fullTitle'))}
                blurb={body.framesBlurb || (isOther ? t('caseStudy.framesBlurb') : t('caseStudy.fullBlurb'))}
                frames={frames}
                onOpen={openViewer}
              />
            )}

            {after.map((b, i) => <Block key={`a-${i}`} block={b} onOpenImage={openImage} />)}

            <CaseStudyEnd next={body.next?.route ? body.next : undefined} />
          </main>

          <Footer />

          {viewerImages.length > 0 && (
            <ImageViewer
              images={viewerImages}
              currentIndex={viewerIndex}
              isOpen={viewerOpen}
              onClose={() => setViewerOpen(false)}
              onNavigate={setViewerIndex}
            />
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default CaseStudyView;
