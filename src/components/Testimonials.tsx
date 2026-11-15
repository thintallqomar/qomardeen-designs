import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@/components/ScrollReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import { testimonials } from '@/data/testimonials';

/** Renders nothing until real testimonials are added to src/data/testimonials.ts. */
const Testimonials = () => {
  const { t } = useTranslation();
  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('testimonials.title')}</h2>
        </ScrollReveal>
        <StaggeredReveal
          className={`grid gap-5 mx-auto ${testimonials.length === 1 ? 'max-w-2xl' : 'max-w-5xl sm:grid-cols-2'}`}
          staggerDelay={0.1}
        >
          {testimonials.map((item, i) => (
            <figure key={i} className="card-elegant flex flex-col h-full">
              <Quote className="w-6 h-6 text-primary mb-4" aria-hidden="true" />
              <blockquote className="text-base leading-relaxed flex-1">“{item.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{item.name}</span>
                {(item.role || item.company) && (
                  <span className="block text-muted-foreground">{[item.role, item.company].filter(Boolean).join(' · ')}</span>
                )}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block py-2 text-primary hover:underline">
                    LinkedIn
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </StaggeredReveal>
      </div>
    </section>
  );
};

export default Testimonials;
