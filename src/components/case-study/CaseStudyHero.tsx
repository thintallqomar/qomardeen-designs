import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface CaseStudyHeroProps {
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  behanceUrl: string;
  meta: { label: string; value: string }[];
  onCoverClick?: () => void;
}

const CaseStudyHero = ({
  title,
  subtitle,
  description,
  coverImage,
  coverAlt,
  behanceUrl,
  meta,
  onCoverClick,
}: CaseStudyHeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const coverY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const coverScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.4]);

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-end overflow-hidden">
      {/* Parallax Cover Image */}
      <motion.div
        style={{ y: coverY, scale: coverScale }}
        className="absolute inset-0"
      >
        <button
          onClick={onCoverClick}
          className="w-full h-full cursor-zoom-in focus:outline-none"
          aria-label={`View ${coverAlt} in fullscreen`}
        >
          <img
            src={coverImage}
            alt={coverAlt}
            className="w-full h-full object-cover"
          />
        </button>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background"
        />
      </motion.div>

      {/* Hero Text Content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full pb-16 md:pb-24"
      >
        <div className="container-custom">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-sm font-medium text-primary mb-6">
                {subtitle}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {meta.map((item, i) => (
                <div key={i} className="px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg">
                  <span className="text-xs text-muted-foreground block">{item.label}</span>
                  <span className="font-medium text-sm">{item.value}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <a
                href={behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-2 h-11 px-6"
              >
                <ExternalLink className="w-4 h-4" />
                View on Behance
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CaseStudyHero;
