import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
import { CaseStudyHeader, CaseStudyFrames, CaseStudyEnd } from '@/components/caseStudy/CaseStudyParts';
import { fetchBySlug, projectKind, type CaseStudyBody } from '@/lib/cms';

const CaseStudyPage = ({ slug: slugProp }: { slug?: string }) => {
  const { t } = useTranslation();
  const params = useParams();
  const slug = slugProp ?? params.slug ?? '';
  const navigate = useNavigate();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => fetchBySlug('case_study', slug),
    enabled: !!slug,
    retry: 1, // one quick retry, then show the message instead of a long spinner
  });

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen pt-36 container-custom">
          <Skeleton className="h-10 w-2/3 max-w-md mb-6" />
          <Skeleton className="h-5 w-full max-w-xl mb-2" />
          <Skeleton className="h-5 w-1/2 max-w-md mb-12" />
          <Skeleton className="w-full aspect-[16/9] max-w-3xl rounded-xl" />
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
            <CaseStudyHeader
              badge={body.badge}
              title={data.title}
              lead={data.subtitle || data.excerpt || undefined}
              facts={[
                { label: t('caseStudy.role'), value: body.role || '' },
                { label: t('caseStudy.scope'), value: body.scope || '' },
                { label: t('caseStudy.platform'), value: body.platform || '' },
                { label: t('caseStudy.timeline'), value: body.timeline || '' },
              ]}
              liveUrl={liveUrl || undefined}
            />

            {/* Story (up to three steps) */}
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
              <CaseStudyFrames
                title={isOther ? t('caseStudy.framesTitle') : t('caseStudy.fullTitle')}
                blurb={isOther ? t('caseStudy.framesBlurb') : t('caseStudy.fullBlurb')}
                frames={gallery.map((g, i) => ({ src: g.src, alt: g.alt || g.label || `Frame ${i + 1}`, label: g.label }))}
                onOpen={openViewer}
              />
            )}

            <CaseStudyEnd />
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
