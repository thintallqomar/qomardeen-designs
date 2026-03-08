import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Hotspot {
  x: number; // percentage
  y: number; // percentage
  label: string;
  description: string;
}

interface WalkthroughStep {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  hotspots?: Hotspot[];
}

interface GuidedWalkthroughProps {
  steps: WalkthroughStep[];
  projectTitle: string;
  triggerLabel?: string;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const GuidedWalkthrough = ({
  steps,
  projectTitle,
  triggerLabel = 'Interactive Walkthrough',
}: GuidedWalkthroughProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > currentStep ? 1 : -1);
      setCurrentStep(next);
      setActiveHotspot(null);
    },
    [currentStep]
  );

  const next = () => currentStep < steps.length - 1 && goTo(currentStep + 1);
  const prev = () => currentStep > 0 && goTo(currentStep - 1);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setCurrentStep(0);
          setActiveHotspot(null);
        }}
        className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          <Play className="w-4 h-4 text-primary ml-0.5" />
        </div>
        <div className="text-left">
          <span className="block text-sm font-semibold text-foreground">{triggerLabel}</span>
          <span className="block text-xs text-muted-foreground">{steps.length} steps · {projectTitle}</span>
        </div>
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-background/98 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">{projectTitle}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <span>Step {currentStep + 1} of {steps.length}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-muted">
              <motion.div
                className="h-full bg-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease }}
              />
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Image panel */}
              <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    className="relative w-full h-full max-w-4xl max-h-[70vh] rounded-xl overflow-hidden border border-border bg-card shadow-lg"
                    initial={(d: number) => ({
                      opacity: 0,
                      x: (d || 1) * 60,
                      scale: 0.96,
                    })}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={(d: number) => ({
                      opacity: 0,
                      x: (d || 1) * -60,
                      scale: 0.96,
                    })}
                    transition={{ duration: 0.4, ease }}
                  >
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="w-full h-full object-contain"
                    />

                    {/* Hotspots */}
                    {step.hotspots?.map((hotspot, i) => (
                      <button
                        key={i}
                        className="absolute group/hotspot"
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                      >
                        {/* Pulse ring */}
                        <span className="absolute -inset-3 rounded-full bg-primary/20 animate-ping" />
                        <span className="relative z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg">
                          {i + 1}
                        </span>

                        {/* Tooltip */}
                        <AnimatePresence>
                          {activeHotspot === i && (
                            <motion.div
                              className="absolute z-20 left-8 top-1/2 -translate-y-1/2 w-64 p-4 rounded-xl bg-card border border-border shadow-xl"
                              initial={{ opacity: 0, x: -8, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -8, scale: 0.95 }}
                              transition={{ duration: 0.2, ease }}
                            >
                              <h4 className="text-sm font-semibold mb-1">{hotspot.label}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{hotspot.description}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Info sidebar */}
              <div className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border/50 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">
                        Step {currentStep + 1}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                      {step.hotspots && step.hotspots.length > 0 && (
                        <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {step.hotspots.length} interactive hotspot{step.hotspots.length > 1 ? 's' : ''} — tap to explore
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button size="sm" onClick={next} className="rounded-full">
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setIsOpen(false)} className="rounded-full">
                      Finish
                    </Button>
                  )}
                </div>

                {/* Step dots */}
                <div className="flex gap-1.5 justify-center mt-4">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? 'w-6 bg-primary'
                          : i < currentStep
                          ? 'w-1.5 bg-primary/40'
                          : 'w-1.5 bg-muted-foreground/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuidedWalkthrough;
