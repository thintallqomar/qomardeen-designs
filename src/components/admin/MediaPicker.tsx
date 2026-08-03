import MediaBrowser from './MediaBrowser';
import type { MediaAsset } from '@/lib/media';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
}

/** Reusable media picker modal — used by the editor cover image and Tiptap. */
const MediaPicker = ({ open, onClose, onSelect, title = 'Choose an image' }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-3 md:p-8 overflow-y-auto" onClick={onClose}>
      <div className="card-elegant w-full max-w-4xl p-4 md:p-6 my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
        </div>
        <MediaBrowser compact onSelect={asset => { onSelect(asset); onClose(); }} />
      </div>
    </div>
  );
};

export default MediaPicker;
