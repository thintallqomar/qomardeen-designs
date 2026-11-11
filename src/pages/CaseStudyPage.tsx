import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ImageViewer from '@/components/ImageViewer';
import StickyScrollSection from '@/components/StickyScrollSection';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchBySlug, type CaseStudyBody } from '@/lib/cms';

const CaseStudyPage = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => fetchBySlug('case_study', slug),
    enabled: !!slug,
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <h1 className="text-2xl font-bold mb-3">Case study not found</h1>
          <p className="text-muted-foreground mb-6">This case study may have been moved or unpublished.</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </>
    );
  }

  const body = (data.body_json as CaseStudyBody | null) ?? { sections: [], gallery: [] };
  const sections = Array.isArray(body.sections) ? body.sections.filter(s => s.image) : [];
  const gallery = Array.isArray(body.gallery) ? body.gallery.filter(g => g.src) : [];
  const behanceUrl = body.behanceUrl || data.resource_url || '';
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
          {/* Reading Progress Bar */}
          <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30">
            <Progress value={scrollProgress} className="h-1 rounded-none" />
          </div>

          {/* Back to Projects */}
          <div className="fixed top-20 left-4 z-40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/projects')}
              className="bg-background/80 backdrop-blur-sm border-border shadow-md hover:bg-background"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

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
                        <span className="text-xs text-muted-foreground block">Role</span>
                        <span className="font-medium">{body.role}</span>
                      </div>
                    )}
                    {body.scope && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">Scope</span>
                        <span className="font-medium">{body.scope}</span>
                      </div>
                    )}
                    {body.platform && (
                      <div className="px-4 py-2 bg-card border border-border rounded-lg">
                        <span className="text-xs text-muted-foreground block">Platform</span>
                        <span className="font-medium">{body.platform}</span>
                      </div>
                    )}
                  </div>
                  {behanceUrl && (
                    <div className="flex justify-center">
                      <a
                        href={behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-8"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Behance
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
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">Full Case Study</h2>
                      <p className="text-muted-foreground">Scroll through every frame of the design process</p>
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

            {/* Bottom CTA */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to see more?</h2>
                  <p className="text-muted-foreground mb-8">
                    {behanceUrl ? 'View the full case study on Behance or get in touch to discuss your project.' : 'Get in touch to discuss your project.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {behanceUrl && (
                      <a
                        href={behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-6"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Behance
                      </a>
                    )}
                    <Button variant="outline" onClick={() => navigate('/contact')} className="h-11 px-6">
                      Get in Touch
                    </Button>
                  </div>
                </div>
              </div>
            </section>
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
