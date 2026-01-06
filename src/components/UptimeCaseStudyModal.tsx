import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import all case study images
import frame01 from '@/assets/uptime/frame-01.png';
import frame02 from '@/assets/uptime/frame-02.png';
import frame03 from '@/assets/uptime/frame-03.png';
import frame04 from '@/assets/uptime/frame-04.png';
import frame05 from '@/assets/uptime/frame-05.png';
import frame06 from '@/assets/uptime/frame-06.png';
import frame07 from '@/assets/uptime/frame-07.png';
import frame08 from '@/assets/uptime/frame-08.png';
import frame09 from '@/assets/uptime/frame-09.png';

const caseStudyImages = [
  { src: frame01, alt: 'UpTime - UI/UX Case Study Cover' },
  { src: frame02, alt: 'Product Overview - Frustrations and Solutions' },
  { src: frame03, alt: 'Design Approach - Core Features' },
  { src: frame04, alt: 'Project Timeline' },
  { src: frame05, alt: 'User Persona - Eng. Tunde Balogun' },
  { src: frame06, alt: 'Empathy Map' },
  { src: frame07, alt: 'User Flow' },
  { src: frame08, alt: 'Brand Identity' },
  { src: frame09, alt: 'Dashboard & Features' },
];

interface UptimeCaseStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UptimeCaseStudyModal = ({ open, onOpenChange }: UptimeCaseStudyModalProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">UpTime — CMMS Web App</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">UI/UX Case Study</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://www.behance.net/gallery/239892845/UpTime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={16} />
                View on Behance
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Image Gallery */}
        <ScrollArea className="flex-1 h-full">
          <div className="flex flex-col">
            {caseStudyImages.map((image, index) => (
              <div 
                key={index} 
                className="relative w-full"
              >
                {/* Skeleton loader */}
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center min-h-[300px]">
                    <span className="text-muted-foreground text-sm">Loading...</span>
                  </div>
                )}
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  onLoad={() => handleImageLoad(index)}
                  className={`w-full h-auto object-contain transition-opacity duration-300 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
            ))}
          </div>
          
          {/* Footer with Behance CTA */}
          <div className="bg-muted/50 border-t border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Want to see more details? View the full case study on Behance.
            </p>
            <a
              href="https://www.behance.net/gallery/239892845/UpTime"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ExternalLink size={16} />
              View on Behance
            </a>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UptimeCaseStudyModal;
