import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FullWidthFrameProps {
  image: string;
  imageAlt: string;
  caption?: string;
  onImageClick?: () => void;
}

const FullWidthFrame = ({ image, imageAlt, caption, onImageClick }: FullWidthFrameProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="py-12 md:py-20"
    >
      <div className="container-custom">
        <div className="max-w-[1512px] mx-auto">
          <button
            onClick={onImageClick}
            className="w-full rounded-xl overflow-hidden border border-border bg-card shadow-lg cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          {caption && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              {caption}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FullWidthFrame;
