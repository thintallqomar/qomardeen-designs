import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { downloadCv } from '@/lib/cv';

/** "Download CV" button that works even though the PDF host blocks direct links. */
const CvDownloadButton = ({ className = 'btn-outline', label = 'Download CV' }: { className?: string; label?: string }) => {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await downloadCv();
    setBusy(false);
    if (!ok) toast.error('The CV could not be downloaded right now. Email me and I will send it over.');
  };

  return (
    <button type="button" onClick={onClick} disabled={busy} className={className}>
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default CvDownloadButton;
