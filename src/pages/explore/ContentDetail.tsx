import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import ArticlePage from '@/pages/ArticlePage';
import { fetchBySlug, pathToType } from '@/lib/cms';
import { getPostBySlug } from '@/data/articles';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { Clock, Download } from 'lucide-react';

const SITE_ORIGIN = 'https://qomardeentijani.lovable.app';

const ContentDetail = () => {
  const { section = 'articles', slug = '' } = useParams();
  const type = pathToType(section);
  const localizedPath = useLocalizedPath();

  const legacy = getPostBySlug(slug);

  const { data: item, isLoading } = useQuery({
    queryKey: ['cms', 'item', type, slug],
    queryFn: () => fetchBySlug(type!, slug),
    enabled: !!type && !legacy,
  });

  // Article/BlogPosting structured data for rich results.
  useEffect(() => {
    if (!item) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'Article',
      headline: item.title,
      description: item.seo_description ?? item.excerpt ?? undefined,
      image: item.seo_image ?? item.cover_image ?? undefined,
      datePublished: item.publish_date ?? item.created_at,
      dateModified: item.updated_date ?? item.updated_at,
      author: { '@type': 'Person', name: item.author_name ?? 'Qomardeen Tijani' },
      mainEntityOfPage: `${SITE_ORIGIN}/en/explore/${section}/${item.slug}`,
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [item, section, type]);

  // Legacy in-code articles keep their existing layout untouched.
  if (legacy) return <ArticlePage />;

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!item || item.status !== 'published' || item.visibility === 'private') {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-14 flex flex-col items-center justify-center gap-4 text-center px-6">
          <h1 className="text-2xl font-bold">Not found</h1>
          <p className="text-muted-foreground">This piece doesn’t exist or isn’t published yet.</p>
          <Link to={localizedPath(`/explore/${section}`)} className="text-primary hover:underline text-sm">
            ← Back to {section}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <ReadingProgress />
      <PageSEO
        title={item.seo_title ?? item.title}
        description={item.seo_description ?? item.excerpt ?? item.title}
        path={`/explore/${section}/${item.slug}`}
        image={item.seo_image ?? item.cover_image ?? undefined}
        type="article"
      />
      <PageTransition>
        <main className="min-h-screen pt-14">
          <article className="section-padding">
            <div className="container-custom max-w-[700px]">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
                <Link to={localizedPath('/explore')} className="inline-block py-2 hover:text-foreground">Explore</Link>
                <span className="mx-1.5">/</span>
                <Link to={localizedPath(`/explore/${section}`)} className="hover:text-foreground capitalize">{section}</Link>
              </nav>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">{item.title}</h1>
              {item.subtitle && <p className="text-lg text-muted-foreground mb-4">{item.subtitle}</p>}

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-8">
                {item.publish_date && <span>{new Date(item.publish_date).toLocaleDateString()}</span>}
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.reading_time_minutes} min read</span>
                {item.category && <span className="px-2 py-0.5 rounded-full bg-secondary">{item.category}</span>}
              </div>

              {item.cover_image && (
                <img
                  src={item.cover_image}
                  alt={item.cover_image_alt ?? item.title}
                  loading="lazy"
                  className="w-full rounded-2xl mb-8"
                />
              )}

              {item.tldr && (
                <aside className="card-elegant p-4 mb-8">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">TL;DR</p>
                  <p className="text-sm text-muted-foreground">{item.tldr}</p>
                </aside>
              )}

              {item.resource_url && (
                <a
                  href={item.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium mb-8"
                >
                  <Download className="w-4 h-4" /> Download resource
                </a>
              )}

              {item.body_html && (
                <div className="article-content prose prose-invert max-w-none">
                  <ReactMarkdown>{item.body_html || ''}</ReactMarkdown>
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-border">
                <ShareButtons title={item.title} url={`${SITE_ORIGIN}/en/explore/${section}/${item.slug}`} />
              </div>
            </div>
          </article>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
};

export default ContentDetail;
