import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { Clock, ArrowRight, Search, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import { blogPosts, BLOG_CATEGORIES, type BlogCategory } from '@/data/articles';
import { useLocalizedPosts } from '@/data/useLocalizedArticle';
import { useAIBlogPosts } from '@/hooks/useAIBlogPosts';

const ease = [0.25, 0.1, 0.25, 1] as const;

const Blog = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');

  const localizedPosts = useLocalizedPosts(blogPosts);
  const { data: aiPosts = [] } = useAIBlogPosts();
  const allPosts = useMemo(() => [...localizedPosts, ...aiPosts], [localizedPosts, aiPosts]);
  const featured = allPosts[0];

  const filteredPosts = useMemo(() => {
    return localizedPosts.filter(post => {
      if (post.slug === featured.slug && !search && activeCategory === 'All') return false;
      const matchesSearch = !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, featured.slug, localizedPosts]);

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <ScrollReveal>
                    <div className="text-center mb-12">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('blog.title')}</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('blog.subtitle')}
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Featured article */}
                  <ScrollReveal>
                    <motion.article
                      className="card-elegant group cursor-pointer mb-10 relative overflow-hidden"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.3, ease }}
                      onClick={() => navigate(`/article/${featured.slug}`)}
                    >
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                          {t('blog.featured')}
                        </span>
                      </div>
                      <div className="pt-10">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{featured.category}</span>
                          <span className="text-xs text-muted-foreground">{featured.publishDate}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 max-w-2xl">{featured.excerpt}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <img src={featured.author.avatar} alt="" className="w-6 h-6 rounded-full object-cover" loading="lazy" />
                            <span className="text-xs text-muted-foreground">{featured.author.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featured.readTime}
                          </span>
                          <span className="ml-auto flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                            {t('blog.readArticle')} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </ScrollReveal>

                  {/* Search + Filters */}
                  <ScrollReveal>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          placeholder={t('blog.search')}
                          className="w-full pl-10 pr-8 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all"
                        />
                        {search && (
                          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-8">
                      <button
                        onClick={() => setActiveCategory('All')}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          activeCategory === 'All'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {t('blog.all')}
                      </button>
                      {BLOG_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            activeCategory === cat
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </ScrollReveal>

                  {/* Article list */}
                  <div className="space-y-5">
                    {filteredPosts.length === 0 && (
                      <p className="text-center text-muted-foreground py-12 text-sm">
                        {t('blog.noResults')}
                      </p>
                    )}
                    {filteredPosts.map((post, index) => (
                      <motion.article
                        key={post.slug}
                        className="card-elegant group cursor-pointer"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06, duration: 0.4, ease }}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/article/${post.slug}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                            <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full object-cover" loading="lazy" />
                                <span>{post.author.name}</span>
                              </div>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                              <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all ml-auto">
                                {t('blog.read')} <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>


                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Blog;
