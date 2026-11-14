import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ReadingProgress from '@/components/ReadingProgress';
import FloatingBackButton from '@/components/FloatingBackButton';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ImageViewer from '@/components/ImageViewer';
import StickyScrollSection from '@/components/StickyScrollSection';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchBySlug, projectKind, type CaseStudyBody } from '@/lib/cms';

const LIVE_LINK_CLASS =
  'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-border bg-background text-foreground font-semibold text-sm hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const CaseStudyPage = ({ slug: slugProp }: { slug?: string }) => {
  const { t } = useTranslation();
  const params = useParams();
  const slug = slugProp ?? params.slug ?? '';
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => fetchBySlug('case_study', slug),
    enabled: !!slug,
  });

  const handleImageLoad = (index: number) =>
    setLoadedImages(prev => new Set([...prev, index]));

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-32 container-custom">
          <Skeleton className="h-10 w-2/3 max-w-md mx-auto mb-6" />
          <Skeleton className="h-5 w-full max-w-xl mx-auto mb-2" />
          <Skeleton className="h-5 w-1/2 max-w-md mx-auto mb-12" />
          <Skeleton className="w-full aspect-[16/9] max-w-3xl mx-auto rounded-xl" />
        </div>
      </>
    );
  }

  // Not found / unpublished
  const isVisible = data && data.status === 'published' && data.visibility === 'public';
  if (isError || !data || !isVisible) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold mb-3">{t('caseStudy.notFoundTitle')}</h1>
          <p className="text-muted-foreground mb-6">{t('caseStudy.notFoundBody')}</p>
          <Button onClick={() => navigate('/projects')}>{t('caseStudy.back')}</Button>
        </div>
      </>
    );
  }

  const body = (data.body_json as CaseStudyBody | null) ?? { sections: [], gallery: [] };
  const sections = Array.isArray(body.sections) ? body.sections.filter(s => s.image) : [];
  const gallery = Array.isArray(body.gallery) ? body.gallery.filter(g => g.src) : [];
  const liveUrl = body.behanceUrl || data.resource_url || '';
  const isOther = projectKind(body) === 'other';
  const viewerImages = gallery.map((g, i) => ({ src: g.src, alt: g.alt || g.label || `Frame ${i + 1}` }));

  const openViewer = (index: number) => { setViewerIndex(index); setViewerOpen(true); };

  return (
    <>
      <Navigation />
      <PageSEO
        title={data.seo_title || `${data.title} — Qomardeen Tijani`}
        description={data.seo_description || data.excerpt || data.subtitle || ''}
        path={`/projects/${data.slug}`}
        image={data.cover_image || undefined}
      />
      <PageTransition>
        <div className="min-h-screen">
          <ReadingProgress />

          <FloatingBackButton />

          <main className="pt-14">
            {/* Project Hero */}
            <section className="pt-20 pb-2 md:pt-24 md:pb-4 bg-gradient-subtle">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center">
                  {body.badge && (
                    <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                      {body.badge}
                    </div>
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
                  {(data.subtitle || data.excerpt) && (
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                      {data.subtitle || data.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {body.role && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">{t('caseStudy.role')}</span>
                        <span className="font-medium">{body.role}</span>
                      </div>
                    )}
                    {body.scope && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">{t('caseStudy.scope')}</span>
                        <span className="font-medium">{body.scope}</span>
                      </div>
                    )}
                    {body.platform && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">{t('caseStudy.platform')}</span>
                        <span className="font-medium">{body.platform}</span>
                      </div>
                    )}
                    {body.timeline && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">{t('caseStudy.timeline')}</span>
                        <span className="font-medium">{body.timeline}</span>
                      </div>
                    )}
                  </div>
                  {liveUrl && (
                    <div className="flex justify-center">
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={LIVE_LINK_CLASS}>
                        <ExternalLink className="w-4 h-4" />
                        {t('caseStudy.viewLive')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Sticky Scroll Storytelling */}
            {sections.length > 0 && (
              <StickyScrollSection
                items={sections.map(s => ({
                  title: s.title,
                  subtitle: s.subtitle,
                  description: s.description,
                  descriptionJson: s.descriptionJson,
                  image: s.image,
                  imageAlt: s.imageAlt || s.title,
                  metrics: s.metrics,
                }))}
              />
            )}

            {/* Full-frame gallery */}
            {gallery.length > 0 && (
              <>
                <ScrollReveal>
                  <div className="container-custom py-8">
                    <div className="text-center">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">{isOther ? t('caseStudy.framesTitle') : t('caseStudy.fullTitle')}</h2>
                      <p className="text-muted-foreground">{isOther ? t('caseStudy.framesBlurb') : t('caseStudy.fullBlurb')}</p>
                    </div>
                  </div>
                </ScrollReveal>

                <section id="case-study-content" className="py-12 md:py-20">
                  <div className="container-custom">
                    <div className="max-w-[1512px] mx-auto space-y-8 md:space-y-12">
                      {gallery.map((image, index) => (
                        <div key={index} className="relative">
                          {image.label && (
                            <div className="mb-4 flex items-center gap-3">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="text-sm font-medium text-muted-foreground">{image.label}</span>
                            </div>
                          )}
                          <button
                            onClick={() => openViewer(index)}
                            className="relative rounded-xl overflow-hidden border border-border bg-card shadow-sm w-full text-left cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label={`View ${image.alt || image.label || `frame ${index + 1}`} in fullscreen`}
                          >
                            {!loadedImages.has(index) && <Skeleton className="w-full aspect-[16/9]" />}
                            <img
                              src={image.src}
                              alt={image.alt || image.label || `Frame ${index + 1}`}
                              loading="lazy"
                              decoding="async"
                              onLoad={() => handleImageLoad(index)}
                              className={`w-full h-auto max-w-none transition-opacity duration-300 ${
                                loadedImages.has(index) ? 'opacity-100' : 'opacity-0 absolute inset-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}


          </main>

          <Footer />

          {gallery.length > 0 && (
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

export default CaseStudyPage;
