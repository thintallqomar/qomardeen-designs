import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { blogPosts } from '@/data/articles';

const ease = [0.25, 0.1, 0.25, 1] as const;

const Blog = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-16">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Insights on product design, systems thinking, and building digital products
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-6">
                    {blogPosts.map((post, index) => (
                      <motion.article
                        key={post.slug}
                        className="card-elegant group cursor-pointer"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.4, ease }}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/article/${post.slug}`)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.tag}</span>
                              <span className="text-xs text-muted-foreground">{post.date}</span>
                            </div>
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                            <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                              <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                                Read article <ArrowRight className="w-3 h-3" />
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
