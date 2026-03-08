import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, ArrowRight, Clock, Calendar, User, Tag } from 'lucide-react';
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
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                      whileHover={{ x: -4 }}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
                      Back to {post.section === 'thinking' ? 'Thinking' : 'Blog'}
                    </motion.button>
                  </ScrollReveal>

                  <ScrollReveal>
                    <header className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider px-2.5 py-1 bg-primary/10 rounded-md">
                          {post.category}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                      </h1>
                      <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

                      {/* Author + metadata bar */}
                      <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
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
              </div>
            </section>

            {/* Article body with TOC sidebar */}
            <section className="section-padding pt-8">
              <div className="container-custom">
                <div className="max-w-5xl mx-auto flex gap-12">
                  {/* Main content */}
                  <div className="max-w-3xl flex-1 min-w-0">
                    <div className="prose prose-lg prose-invert max-w-none
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:scroll-mt-20
                      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-foreground
                      prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                      prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                      prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto
                      prose-pre:prose-code:bg-transparent prose-pre:prose-code:p-0
                      prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                      prose-li:mb-1
                      prose-table:border-collapse
                      prose-th:text-foreground prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2 prose-th:bg-secondary
                      prose-td:text-muted-foreground prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
                      prose-hr:border-border
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
                      <div className="flex items-center gap-2 mt-10 pt-6 border-t border-border flex-wrap">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs px-2.5 py-1 bg-secondary text-muted-foreground rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Share */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                      <ShareButtons title={post.title} />
                    </div>

                    {/* Prev / Next navigation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                      {prev && (
                        <motion.button
                          onClick={() => navigate(`/article/${prev.slug}`)}
                          className="card-elegant text-left group"
                          whileHover={{ y: -2 }}
                        >
                          <span className="text-xs text-muted-foreground mb-1 block">← Previous</span>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{prev.title}</span>
                        </motion.button>
                      )}
                      {next && (
                        <motion.button
                          onClick={() => navigate(`/article/${next.slug}`)}
                          className="card-elegant text-right group sm:col-start-2"
                          whileHover={{ y: -2 }}
                        >
                          <span className="text-xs text-muted-foreground mb-1 block">Next →</span>
                          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">{next.title}</span>
                        </motion.button>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 pt-8 border-t border-border">
                      <div className="card-elegant p-6 text-center">
                        <p className="text-muted-foreground mb-4">
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
