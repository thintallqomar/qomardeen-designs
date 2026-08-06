import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const ease = [0.25, 0.1, 0.25, 1] as const;

const FeaturedProjects = () => {
  const navigate = useLocalizedNavigate();
  const { t } = useTranslation();

  const projects = [
    {
      title: "UpTime Asset Management",
      industry: t('featured.uptime.industry'),
      problem: t('featured.uptime.problem'),
      route: '/projects/uptime',
      thumbnail: uptimeCover,
    },
    {
      title: "WalPay Digital Wallet",
      industry: t('featured.walpay.industry'),
      problem: t('featured.walpay.problem'),
      route: '/projects/walpay',
      thumbnail: walpayCover,
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('featured.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('featured.subtitle')}</p>
          </div>
        </ScrollReveal>

        <StaggeredReveal className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto" staggerDelay={0.12} equalHeight>
          {projects.map((project) => (
            <motion.div key={project.route} className="card-elegant group cursor-pointer h-full flex flex-col overflow-hidden p-0" whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }} transition={{ duration: 0.3, ease }} onClick={() => navigate(project.route)}>
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{project.industry}</span>
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.problem}</p>
                <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  {t('featured.viewCase')} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </StaggeredReveal>
      </div>
    </section>
  );
};

export default FeaturedProjects;
