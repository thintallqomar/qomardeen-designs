import { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Upload, Search, Trash2, Copy, Check, RefreshCw, Pencil, FolderPlus, Loader2, ImageIcon,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';
import {
  listMedia, uploadMedia, deleteMedia, replaceMedia, updateMedia, storageUsage,
  folderList, formatBytes, STORAGE_QUOTA_BYTES, type MediaAsset,
} from '@/lib/media';

interface Props {
  /** When set, clicking a tile selects it instead of just opening details. */
  onSelect?: (asset: MediaAsset) => void;
  compact?: boolean;
}

const inputCls =
  'w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary';

const MediaBrowser = ({ onSelect, compact }: Props) => {
  const qc = useQueryClient();
  const { data: assets = [], isLoading } = useQuery({ queryKey: ['media'], queryFn: listMedia });

  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState<string>('all');
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [active, setActive] = useState<MediaAsset | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const folders = useMemo(() => folderList(assets), [assets]);
  const used = useMemo(() => storageUsage(assets), [assets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter(a => {
      if (folder !== 'all' && (a.folder || 'uploads') !== folder) return false;
      if (!q) return true;
      return `${a.file_name} ${a.alt_text ?? ''} ${a.folder}`.toLowerCase().includes(q);
    });
  }, [assets, query, folder]);

  const refresh = () => qc.invalidateQueries({ queryKey: ['media'] });

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    let ok = 0;
    for (const file of list) {
      try {
        await uploadMedia(file, folder === 'all' ? 'uploads' : folder);
        ok++;
      } catch (e: any) {
        toast.error(`${file.name}: ${e.message ?? 'upload failed'}`);
      }
    }
    setBusy(false);
    if (ok) toast.success(`${ok} file${ok > 1 ? 's' : ''} uploaded`);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const copyUrl = async (asset: MediaAsset) => {
    await navigator.clipboard.writeText(asset.public_url);
    setCopied(asset.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const remove = async (asset: MediaAsset) => {
    if (!window.confirm(`Delete "${asset.file_name}"? References to it will break.`)) return;
    try {
      await deleteMedia(asset);
      if (active?.id === asset.id) setActive(null);
      toast.success('Deleted');
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? 'Delete failed');
    }
  };

  const rename = async (asset: MediaAsset) => {
    const name = window.prompt('File name', asset.file_name);
    if (!name || name === asset.file_name) return;
    await updateMedia(asset.id, { file_name: name });
    refresh();
  };

  const newFolder = () => {
    const name = window.prompt('New folder name (used for the next uploads)');
    if (!name) return;
    setFolder(name.toLowerCase().replace(/[^a-z0-9-]+/g, '-'));
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={`relative ${dragging ? 'ring-2 ring-primary rounded-2xl' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search media…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select value={folder} onChange={e => setFolder(e.target.value)} className={`${inputCls} w-auto`}>
          <option value="all">All folders</option>
          {folders.map(f => <option key={f} value={f}>{f}</option>)}
          {folder !== 'all' && !folders.includes(folder) && <option value={folder}>{folder}</option>}
        </select>
        <IconTooltip label="New folder">
          <button onClick={newFolder} aria-label="New folder" className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
            <FolderPlus className="w-4 h-4" />
          </button>
        </IconTooltip>
        <IconTooltip label="Refresh">
          <button onClick={refresh} aria-label="Refresh" className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
          </button>
        </IconTooltip>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{assets.length} items · {formatBytes(used)} used</span>
          <span>{Math.min(100, Math.round((used / STORAGE_QUOTA_BYTES) * 100))}% of {formatBytes(STORAGE_QUOTA_BYTES)}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, (used / STORAGE_QUOTA_BYTES) * 100)}%` }} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground py-8 text-center">Loading media…</p>}

      {!isLoading && filtered.length === 0 && (
        <div className="border border-dashed border-border rounded-2xl py-14 text-center">
          <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Drag and drop images here, or use Upload.</p>
        </div>
      )}

      <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
        {filtered.map(asset => (
          <div key={asset.id} className="group card-elegant overflow-hidden">
            <button
              type="button"
              onClick={() => (onSelect ? onSelect(asset) : setActive(asset))}
              className="block w-full aspect-[4/3] bg-secondary"
            >
              <img
                src={asset.public_url}
                alt={asset.alt_text ?? asset.file_name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
            <div className="p-2.5">
              <p className="text-xs font-medium truncate" title={asset.file_name}>{asset.file_name}</p>
              <p className="text-[10px] text-muted-foreground">{formatBytes(asset.file_size)} · {asset.folder}</p>
              <div className="flex items-center gap-0.5 mt-1.5">
                <IconTooltip label="Copy URL">
                  <button onClick={() => copyUrl(asset)} aria-label="Copy URL" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                    {copied === asset.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </IconTooltip>
                <IconTooltip label="Edit details">
                  <button onClick={() => setActive(asset)} aria-label="Edit details" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </IconTooltip>
                <IconTooltip label="Delete">
                  <button onClick={() => remove(asset)} aria-label="Delete" className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-secondary">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </IconTooltip>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="card-elegant w-full max-w-lg p-5 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <img src={active.public_url} alt={active.alt_text ?? active.file_name} className="w-full rounded-xl" />
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alt text</span>
              <input
                defaultValue={active.alt_text ?? ''}
                onBlur={async e => { await updateMedia(active.id, { alt_text: e.target.value }); refresh(); }}
                className={`${inputCls} mt-1.5`}
                placeholder="Describe the image for screen readers and SEO"
              />
            </label>
            <p className="text-xs text-muted-foreground break-all">{active.storage_path} · {active.width ?? '?'}×{active.height ?? '?'} · {formatBytes(active.file_size)}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => copyUrl(active)} className="px-3 py-1.5 rounded-xl bg-secondary text-sm">Copy URL</button>
              <button onClick={() => rename(active)} className="px-3 py-1.5 rounded-xl bg-secondary text-sm">Rename</button>
              <button onClick={() => replaceRef.current?.click()} className="px-3 py-1.5 rounded-xl bg-secondary text-sm">Replace image</button>
              {onSelect && (
                <button onClick={() => onSelect(active)} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Use this image</button>
              )}
              <button onClick={() => setActive(null)} className="px-3 py-1.5 rounded-xl text-sm text-muted-foreground ml-auto">Close</button>
            </div>
            <input
              ref={replaceRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async e => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                setBusy(true);
                try {
                  await replaceMedia(active, file);
                  toast.success('Image replaced');
                  refresh();
                } catch (err: any) {
                  toast.error(err.message ?? 'Replace failed');
                } finally {
                  setBusy(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaBrowser;
