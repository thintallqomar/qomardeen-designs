import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPostBySlug } from '@/data/articles';

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

  const backPath = post.category === 'thinking' ? '/thinking' : '/blog';

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <article className="section-padding">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  {/* Back button */}
                  <ScrollReveal>
                    <motion.button
                      onClick={() => navigate(backPath)}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                      whileHover={{ x: -4 }}
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
                      Back to {post.category === 'thinking' ? 'Thinking' : 'Blog'}
                    </motion.button>
                  </ScrollReveal>

                  {/* Header */}
                  <ScrollReveal>
                    <header className="mb-12">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">
                        {post.tag}
                      </span>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {post.readTime} read
                        </span>
                      </div>
                    </header>
                  </ScrollReveal>

                  {/* Content */}
                  <ScrollReveal>
                    <div className="prose prose-lg prose-invert max-w-none
                      prose-headings:text-foreground prose-headings:font-bold
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
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                  </ScrollReveal>

                  {/* Footer CTA */}
                  <ScrollReveal>
                    <div className="mt-16 pt-8 border-t border-border">
                      <div className="card-elegant p-6 text-center">
                        <p className="text-muted-foreground mb-4">
                          Enjoyed this article? Let's connect and discuss ideas.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => navigate('/contact')}
                            className="modern-btn text-sm"
                          >
                            Get in Touch
                          </button>
                          <button
                            onClick={() => navigate(backPath)}
                            className="outline-btn text-sm"
                          >
                            More Articles
                          </button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </article>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default ArticlePage;
