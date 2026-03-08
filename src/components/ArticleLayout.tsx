import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import type { BlogPost } from '@/data/articles';
import { getRelatedPosts } from '@/data/articles';

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

// Pull quote renderer for blockquotes
const PullQuote = ({ children, ...props }: any) => (
  <blockquote
    className="editorial-pullquote"
    {...props}
  >
    {children}
  </blockquote>
);

interface ArticleLayoutProps {
  post: BlogPost;
  prev?: BlogPost;
  next?: BlogPost;
}

const ArticleLayout = ({ post, prev, next }: ArticleLayoutProps) => {
  const navigate = useNavigate();
  const backPath = post.section === 'thinking' ? '/thinking' : '/blog';
  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  return (
    <article className="min-h-screen">
      <main className="pt-14">
        {/* ─── Article Header ─── */}
        <section className="pt-16 md:pt-24 pb-0">
          <div className="editorial-container">
            <ScrollReveal>
              <motion.button
                onClick={() => navigate(backPath)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
                whileHover={{ x: -4 }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
                Back to {post.section === 'thinking' ? 'Thinking' : 'Blog'}
              </motion.button>
            </ScrollReveal>

            <ScrollReveal>
              <header className="text-center mb-0">
                {/* Category + Date */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                </div>

                {/* Title */}
                <h1 className="editorial-title">
                  {post.title}
                </h1>

                {/* Divider */}
                <div className="w-16 h-px bg-border mx-auto my-8" />

                {/* Author block */}
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">Product Designer</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 ml-4">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime} read
                  </span>
                </div>
              </header>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Hero Image ─── */}
        {post.heroImage && (
          <section className="editorial-hero-image">
            <ScrollReveal>
              <div className="max-w-[900px] mx-auto px-5 md:px-8">
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
          </section>
        )}

        {/* ─── Article Body + TOC ─── */}
        <section className="editorial-body-section">
          <div className="max-w-[1120px] mx-auto px-5 md:px-8 flex gap-16">
            {/* Main reading column */}
            <div className="editorial-reading-column">
              <div className="editorial-prose">
                <ReactMarkdown
                  components={{
                    h2: createHeadingRenderer(2),
                    h3: createHeadingRenderer(3),
                    blockquote: PullQuote,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* ─── Article Footer ─── */}
              <footer className="editorial-footer">
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-10 border-t border-border flex-wrap">
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

                {/* Author bio block */}
                <div className="mt-12 pt-10 border-t border-border">
                  <div className="flex items-start gap-5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-base font-semibold text-foreground mb-1">
                        Written by {post.author.name}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        Product Designer focused on building thoughtful, scalable digital experiences for fintech, logistics, and AI-native products.
                      </p>
                      <button
                        onClick={() => navigate('/')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        View Portfolio →
                      </button>
                    </div>
                  </div>
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

                {/* Related articles */}
                {relatedPosts.length > 0 && (
                  <div className="mt-14 pt-10 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Related Articles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {relatedPosts.map((related) => (
                        <motion.button
                          key={related.slug}
                          onClick={() => navigate(`/article/${related.slug}`)}
                          className="card-elegant text-left group p-5"
                          whileHover={{ y: -3 }}
                        >
                          {related.heroImage && (
                            <div className="rounded-lg overflow-hidden mb-3 aspect-[16/9]">
                              <img
                                src={related.heroImage}
                                alt={related.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            {related.category}
                          </span>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 block mt-1.5">
                            {related.title}
                          </span>
                          <span className="text-xs text-muted-foreground mt-2 block">
                            {related.readTime} read
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-14 pt-10 border-t border-border">
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
              </footer>
            </div>

            {/* TOC sidebar */}
            <TableOfContents content={post.content} />
          </div>
        </section>
      </main>
    </article>
  );
};

export default ArticleLayout;
