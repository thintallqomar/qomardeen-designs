import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IconTooltip from './IconTooltip';
import cvAsset from '@/assets/Qomardeen_Tijani_CV.pdf.asset.json';

const btnFocus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

interface CVViewerProps {
  open: boolean;
  onClose: () => void;
}

const CVViewer = ({ open, onClose }: CVViewerProps) => {
  const { t } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={t('cv.viewerLabel')}
        >
          {/* Viewer toolbar */}
          <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-14 border-b border-border shrink-0">
            <p className="text-sm font-semibold truncate">{t('cv.viewerTitle')}</p>
            <div className="flex items-center gap-2">
              <a
                href={cvAsset.url}
                download="Qomardeen_Tijani_CV.pdf"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity ${btnFocus}`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('cv.download')}</span>
              </a>
              <IconTooltip label={t('cv.close')}>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label={t('cv.close')}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors ${btnFocus}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </IconTooltip>
            </div>
          </div>

          {/* Rendered document */}
          <div className="flex-1 min-h-0 p-2 md:p-4">
            <iframe
              src={cvAsset.url}
              title={t('cv.viewerTitle')}
              className="w-full h-full rounded-xl border border-border bg-card"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CVViewer;
