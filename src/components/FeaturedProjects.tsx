import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useHiddenProjects } from '@/hooks/useSiteSettings';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const btnFocus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const hidden = useHiddenProjects();

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
  ].filter(p => !hidden.has(p.route.split('/').pop() ?? ''));

  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <h2 className="t-h2 mb-3">{t('featured.title')}</h2>
            <p className="text-muted-foreground">{t('featured.subtitle')}</p>
          </div>
        </ScrollReveal>

        <StaggeredReveal className="grid sm:grid-cols-2 gap-6" staggerDelay={0.12} equalHeight>
          {projects.map((project) => (
            // A real link, so it works with the keyboard and screen readers (it used to be a clickable box)
            <Link key={project.route} to={localizedPath(project.route)} className={`card-elegant group h-full flex flex-col overflow-hidden p-0 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-lg motion-reduce:transform-none ${btnFocus}`}>
              <div className="aspect-[16/10] bg-muted overflow-hidden">
                <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{project.industry}</span>
                <h3 className="t-h3 mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.problem}</p>
                <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  {t('featured.viewCase')} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </StaggeredReveal>

        <div className="mt-10">
          <Link
            to={localizedPath('/projects')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors ${btnFocus}`}
          >
            {t('homeIntro.viewAll')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
