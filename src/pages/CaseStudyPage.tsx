import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navigation from '@/components/Navigation';
import { fetchBySlug, type CaseStudyBody } from '@/lib/cms';
import CaseStudyView from '@/components/caseStudy/CaseStudyView';

const CaseStudyPage = ({ slug: slugProp }: { slug?: string }) => {
  const { t } = useTranslation();
  const params = useParams();
  const slug = slugProp ?? params.slug ?? '';
  const navigate = useNavigate();

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
  return (
    <CaseStudyView
      slug={data.slug}
      title={data.title}
      lead={data.subtitle || data.excerpt || undefined}
      seoTitle={data.seo_title || undefined}
      seoDescription={data.seo_description || data.excerpt || data.subtitle || undefined}
      seoImage={data.cover_image || undefined}
      body={{ ...body, behanceUrl: body.behanceUrl || data.resource_url || '' }}
    />
  );
};

export default CaseStudyPage;
