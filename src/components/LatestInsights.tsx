import { ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import { blogPosts } from '@/data/articles';
import { useLocalizedPosts } from '@/data/useLocalizedArticle';

const ease = [0.25, 0.1, 0.25, 1] as const;
const latestPostsRaw = blogPosts.slice(0, 3);

const LatestInsights = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('insights.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('insights.subtitle')}</p>
          </div>
        </ScrollReveal>

        <StaggeredReveal className="grid md:grid-cols-3 gap-6 mb-10" staggerDelay={0.12} equalHeight>
          {latestPosts.map((post) => (
            <motion.div key={post.slug} className="card-elegant h-full flex flex-col cursor-pointer group" whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }} transition={{ duration: 0.3, ease }} onClick={() => navigate(`/article/${post.slug}`)}>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">{post.category}</span>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                  {t('insights.read')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </StaggeredReveal>

        <div className="text-center">
          <motion.button onClick={() => navigate('/blog')} className="outline-btn inline-flex items-center gap-2 group" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
            {t('insights.viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default LatestInsights;
