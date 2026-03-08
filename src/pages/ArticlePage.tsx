import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPostBySlug, getAdjacentPosts } from '@/data/articles';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import ArticleSEO from '@/components/ArticleSEO';

// Custom heading renderer that adds IDs for TOC linking
const createHeadingRenderer = (level: number) => {
  const Component = ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : 
      Array.isArray(children) ? children.map((c: any) => typeof c === 'string' ? c : c?.props?.children || '').join('') : '';
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag id={id} {...props}>{children}</Tag>;
  };
  Component.displayName = `H${level}`;
  return Component;
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <>
        <Navigation />
        <PageTransition>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Article not found</h1>
              <button onClick={() => navigate('/blog')} className="text-primary hover:underline">
                ← Back to Blog
              </button>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }

  const backPath = post.section === 'thinking' ? '/thinking' : '/blog';
  const { prev, next } = getAdjacentPosts(post.slug, post.section);

  return (
    <>
      <Navigation />
      <ArticleSEO post={post} />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            {/* Hero section */}
            <section className="section-padding pb-0">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal>
                    <motion.button
                      onClick={() => navigate(backPath)}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
                      whileHover={{ x: -4 }}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
                      Back to {post.section === 'thinking' ? 'Thinking' : 'Blog'}
                    </motion.button>
                  </ScrollReveal>

                  <ScrollReveal>
                    <header className="mb-10">
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider px-2.5 py-1 bg-primary/10 rounded-md">
                          {post.category}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-[1.15]">
                        {post.title}
                      </h1>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>

                      {/* Author + metadata bar */}
                      <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-border">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                            loading="lazy"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">Product Designer</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-auto text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.publishDate).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime} read
                          </span>
                        </div>
                      </div>
                    </header>
                  </ScrollReveal>
                </div>

                {/* Hero image — full-width within container */}
                {post.heroImage && (
                  <ScrollReveal>
                    <div className="max-w-4xl mx-auto my-10">
                      <div className="rounded-2xl overflow-hidden border border-border">
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="w-full h-auto object-cover aspect-[16/9]"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </section>

            {/* Article body with TOC sidebar */}
            <section className="section-padding pt-4">
              <div className="container-custom">
                <div className="max-w-5xl mx-auto flex gap-16">
                  {/* Main content */}
                  <div className="max-w-3xl flex-1 min-w-0">
                    <div className="prose prose-lg prose-invert max-w-none
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:scroll-mt-24
                      prose-h2:text-2xl prose-h2:md:text-[1.75rem] prose-h2:mt-12 prose-h2:mb-4 prose-h2:leading-snug
                      prose-h3:text-lg prose-h3:md:text-xl prose-h3:mt-10 prose-h3:mb-3 prose-h3:leading-snug
                      prose-p:text-muted-foreground prose-p:text-base prose-p:md:text-[1.0625rem] prose-p:leading-[1.9] prose-p:mb-6
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-em:text-muted-foreground
                      prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-muted-foreground
                      prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                      prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:my-8
                      prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0
                      prose-ul:text-muted-foreground prose-ul:my-6 prose-ul:space-y-2 prose-ul:text-base prose-ul:md:text-[1.0625rem]
                      prose-ol:text-muted-foreground prose-ol:my-6 prose-ol:space-y-2 prose-ol:text-base prose-ol:md:text-[1.0625rem]
                      prose-li:mb-0.5 prose-li:leading-[1.85]
                      prose-table:border-collapse prose-table:my-8
                      prose-th:text-foreground prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-3 prose-th:bg-secondary
                      prose-td:text-muted-foreground prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3
                      prose-hr:border-border prose-hr:my-12
                      prose-img:rounded-xl prose-img:my-8
                    ">
                      <ReactMarkdown
                        components={{
                          h2: createHeadingRenderer(2),
                          h3: createHeadingRenderer(3),
                        }}
                      >
                        {post.content}
                      </ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-14 pt-8 border-t border-border flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-secondary text-muted-foreground rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Share */}
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                      <ShareButtons title={post.title} />
                    </div>

                    {/* Prev / Next navigation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                      {prev && (
                        <motion.button
                          onClick={() => navigate(`/article/${prev.slug}`)}
                          className="card-elegant text-left group"
                          whileHover={{ y: -2 }}
                        >
                          <span className="text-xs text-muted-foreground mb-2 block">← Previous</span>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{prev.title}</span>
                        </motion.button>
                      )}
                      {next && (
                        <motion.button
                          onClick={() => navigate(`/article/${next.slug}`)}
                          className="card-elegant text-right group sm:col-start-2"
                          whileHover={{ y: -2 }}
                        >
                          <span className="text-xs text-muted-foreground mb-2 block">Next →</span>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{next.title}</span>
                        </motion.button>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 pt-10 border-t border-border">
                      <div className="card-elegant p-8 text-center">
                        <p className="text-muted-foreground mb-5">
                          Enjoyed this article? Let's connect and discuss ideas.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button onClick={() => navigate('/contact')} className="modern-btn text-sm">
                            Get in Touch
                          </button>
                          <button onClick={() => navigate(backPath)} className="outline-btn text-sm">
                            More Articles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOC sidebar */}
                  <TableOfContents content={post.content} />
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

export default ArticlePage;
