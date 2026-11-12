import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Loader2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IconTooltip from './IconTooltip';
import CvDownloadButton from '@/components/CvDownloadButton';
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
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // The CDN serves the PDF with `CSP: default-src 'none'`, which Chrome
  // enforces on any frame that renders it, blocking the PDF viewer.
  // Fetching the file client-side and rendering it from a blob URL
  // sidesteps the frame CSP entirely.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let createdUrl: string | null = null;
    setFailed(false);
    setBlobUrl(null);

    (async () => {
      try {
        const res = await fetch(cvAsset.url, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      } catch {
        // Local previews don't proxy the asset route; offer opening the
        // file directly instead of a broken frame.
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [open]);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = blobUrl ?? cvAsset.url;
    a.download = 'Qomardeen_Tijani_CV.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [blobUrl]);

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

  // Portal to <body> so the viewer escapes any transformed hero stacking context
  return createPortal(
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
              <button
                type="button"
                onClick={handleDownload}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity ${btnFocus}`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('cv.download')}</span>
              </button>
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
            {!blobUrl && !failed && (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-hidden="true" />
              </div>
            )}
            {failed && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6">
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t('cv.openExternalHint', 'The document could not be embedded here.')}
                </p>
                <CvDownloadButton
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity ${btnFocus}`}
                  label={t('cv.download')}
                />
              </div>
            )}
            {blobUrl && (
              <iframe
                src={blobUrl}
                title={t('cv.viewerTitle')}
                className="w-full h-full rounded-xl border border-border bg-card"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CVViewer;
