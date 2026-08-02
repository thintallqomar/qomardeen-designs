import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ScrollReveal from '@/components/ScrollReveal';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { fetchPublished, pathToType, CONTENT_TYPES } from '@/lib/cms';
import { blogPosts, thinkingPosts } from '@/data/articles';
import { Clock, Search, Download } from 'lucide-react';

interface Card {
  key: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  meta: string;
  external?: string;
}

const ExploreSection = () => {
  const { section = 'articles' } = useParams();
  const type = pathToType(section);
  const localizedPath = useLocalizedPath();
  const [search, setSearch] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cms', 'published', type],
    queryFn: () => fetchPublished(type!),
    enabled: !!type,
  });

  const legacy: Card[] = useMemo(() => {
    const source = type === 'article' ? blogPosts : type === 'thinking' ? thinkingPosts : [];
    return source.map(p => ({
      key: `legacy-${p.slug}`,
      href: `/explore/${section}/${p.slug}`,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      tags: p.tags,
      meta: p.readTime,
    }));
  }, [type, section]);

  const cards: Card[] = useMemo(() => {
    const fromDb = items.map(i => ({
      key: i.id,
      href: `/explore/${section}/${i.slug}`,
      title: i.title,
      excerpt: i.excerpt ?? i.subtitle ?? '',
      category: i.category ?? '',
      tags: i.tags ?? [],
      meta: type === 'resource' ? (i.resource_file_type ?? 'Download') : `${i.reading_time_minutes} min read`,
      external: type === 'resource' ? i.resource_url ?? undefined : undefined,
    }));
    const all = [...fromDb, ...legacy];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.excerpt.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [items, legacy, search, section, type]);

  if (!type) return <Navigate to="/explore" replace />;
  const meta = CONTENT_TYPES.find(c => c.value === type)!;

  return (
    <>
      <Navigation />
      <PageSEO
        title={`${meta.label} — Explore`}
        description={meta.blurb}
        path={`/explore/${section}`}
      />
      <PageTransition>
        <main className="min-h-screen pt-14">
          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <ScrollReveal>
                <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
                  <Link to={localizedPath('/explore')} className="hover:text-foreground">Explore</Link>
                  <span className="mx-1.5">/</span>
                  <span className="text-foreground">{meta.label}</span>
                </nav>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{meta.label}</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{meta.blurb}</p>
              </ScrollReveal>

              <div className="relative mb-8">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={`Search ${meta.label.toLowerCase()}`}
                  aria-label={`Search ${meta.label}`}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!isLoading && cards.length === 0 && (
                <p className="text-sm text-muted-foreground">Nothing published here yet — check back soon.</p>
              )}

              <div className="space-y-4">
                {cards.map(card => {
                  const inner = (
                    <>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        {card.category && <span className="px-2 py-0.5 rounded-full bg-secondary">{card.category}</span>}
                        <span className="inline-flex items-center gap-1">
                          {card.external ? <Download className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {card.meta}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold mb-1.5">{card.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{card.excerpt}</p>
                    </>
                  );
                  return card.external ? (
                    <a key={card.key} href={card.external} target="_blank" rel="noreferrer" className="card-elegant p-5 block hover:border-primary/40 transition-colors">
                      {inner}
                    </a>
                  ) : (
                    <ScrollReveal key={card.key}>
                      <Link to={localizedPath(card.href)} className="card-elegant p-5 block hover:border-primary/40 transition-colors">
                        {inner}
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
};

export default ExploreSection;
