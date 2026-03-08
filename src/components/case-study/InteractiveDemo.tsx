import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface DemoStep {
  image: string;
  title: string;
  description: string;
  annotation?: {
    x: number; // percentage
    y: number; // percentage
    label: string;
  };
}

interface InteractiveDemoProps {
  steps: DemoStep[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const InteractiveDemo = ({ steps, title, isOpen, onClose }: InteractiveDemoProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const goNext = useCallback(() => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isOpen, steps.length]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goNext, goPrev]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsAutoPlaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-2 rounded-lg transition-colors ${
              isAutoPlaying ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'
            }`}
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Auto-play'}
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Image with annotations */}
          <div className="flex-1 relative max-w-4xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl overflow-hidden border border-border shadow-2xl"
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto"
                />
                {/* Annotation Pulse */}
                {step.annotation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="absolute"
                    style={{
                      left: `${step.annotation.x}%`,
                      top: `${step.annotation.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-primary animate-ping absolute inset-0 opacity-40" />
                      <div className="w-6 h-6 rounded-full bg-primary relative z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap">
                        <span className="text-xs font-medium">{step.annotation.label}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Text */}
          <div className="lg:w-72 flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentStep
                  ? 'bg-primary w-6'
                  : i < currentStep
                  ? 'bg-primary/40'
                  : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>,
    document.body
  );
};

export default InteractiveDemo;
