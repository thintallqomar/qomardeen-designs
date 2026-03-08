import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickyScrollSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  bulletPoints?: string[];
  image: string;
  imageAlt: string;
  index: number;
  reversed?: boolean;
  onImageClick?: () => void;
}

const StickyScrollSection = ({
  title,
  subtitle,
  description,
  bulletPoints,
  image,
  imageAlt,
  index,
  reversed = false,
  onImageClick,
}: StickyScrollSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, 1, 1, 0.3]);
  const imageScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.96]);

  return (
    <div ref={sectionRef} className="min-h-[80vh] flex items-center py-16 md:py-24">
      <div className="container-custom w-full">
        <div className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${reversed ? 'md:direction-rtl' : ''}`}>
          {/* Text Column */}
          <motion.div
            style={{ opacity: textOpacity }}
            className={`space-y-6 ${reversed ? 'md:order-2 md:direction-ltr' : ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/15 text-primary text-sm font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              {subtitle && (
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  {subtitle}
                </span>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Image Column */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className={`${reversed ? 'md:order-1 md:direction-ltr' : ''}`}
          >
            <button
              onClick={onImageClick}
              className="w-full rounded-xl overflow-hidden border border-border bg-card shadow-lg cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-shadow hover:shadow-xl"
              aria-label={`View ${imageAlt} in fullscreen`}
            >
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StickyScrollSection;
