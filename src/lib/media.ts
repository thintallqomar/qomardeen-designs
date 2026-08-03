import { supabase } from '@/integrations/supabase/client';

export const MEDIA_BUCKET = 'media';
/** Effectively permanent signed URL (10 years) — the bucket itself stays private. */
const SIGNED_TTL = 315_360_000;
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const STORAGE_QUOTA_BYTES = 1024 * 1024 * 1024; // 1 GB soft budget

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];

export interface MediaAsset {
  id: string;
  file_name: string;
  folder: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export const formatBytes = (bytes?: number | null) => {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function drawToBlob(img: HTMLImageElement, maxWidth: number, quality: number) {
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob | null>(res => canvas.toBlob(res, 'image/webp', quality));
}

export interface Optimized {
  blob: Blob;
  ext: string;
  mime: string;
  width: number | null;
  height: number | null;
  thumb: Blob | null;
}

/** Compresses and converts raster images to WebP. SVG/GIF pass through untouched. */
export async function optimizeImage(file: File): Promise<Optimized> {
  const passthrough: Optimized = {
    blob: file,
    ext: file.name.split('.').pop() || 'bin',
    mime: file.type,
    width: null,
    height: null,
    thumb: null,
  };
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return passthrough;
  try {
    const img = await loadImage(file);
    const [main, thumb] = await Promise.all([drawToBlob(img, 1920, 0.82), drawToBlob(img, 480, 0.7)]);
    const w = Math.round(Math.min(img.naturalWidth, 1920));
    const h = Math.round(w * (img.naturalHeight / img.naturalWidth));
    URL.revokeObjectURL(img.src);
    if (!main || main.size >= file.size) return { ...passthrough, width: img.naturalWidth, height: img.naturalHeight, thumb };
    return { blob: main, ext: 'webp', mime: 'image/webp', width: w, height: h, thumb };
  } catch {
    return passthrough;
  }
}

export async function signedUrl(path: string, ttl = SIGNED_TTL) {
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, ttl);
  if (error) throw error;
  return data.signedUrl;
}

const safeName = (name: string) =>
  name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'file';

export async function uploadMedia(file: File, folder = 'uploads', altText = '') {
  if (!ALLOWED.includes(file.type)) throw new Error(`Unsupported file type: ${file.type || 'unknown'}`);
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name} is larger than ${formatBytes(MAX_UPLOAD_BYTES)}`);

  const { blob, ext, mime, width, height, thumb } = await optimizeImage(file);
  const base = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const path = `${base}.${ext}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, blob, { contentType: mime, upsert: false });
  if (error) throw error;

  if (thumb) {
    await supabase.storage.from(MEDIA_BUCKET).upload(`${base}.thumb.webp`, thumb, { contentType: 'image/webp', upsert: true });
  }

  const url = await signedUrl(path);
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error: dbError } = await supabase
    .from('media_assets')
    .insert({
      file_name: file.name,
      folder,
      storage_path: path,
      public_url: url,
      alt_text: altText || null,
      mime_type: mime,
      file_size: blob.size,
      width,
      height,
      uploaded_by: user?.id ?? null,
    })
    .select('*')
    .single();
  if (dbError) throw dbError;
  return data as unknown as MediaAsset;
}

export async function listMedia() {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MediaAsset[];
}

export async function updateMedia(id: string, patch: Partial<Pick<MediaAsset, 'file_name' | 'alt_text' | 'folder'>>) {
  const { error } = await supabase.from('media_assets').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteMedia(asset: MediaAsset) {
  const base = asset.storage_path.replace(/\.[^.]+$/, '');
  await supabase.storage.from(MEDIA_BUCKET).remove([asset.storage_path, `${base}.thumb.webp`]);
  const { error } = await supabase.from('media_assets').delete().eq('id', asset.id);
  if (error) throw error;
}

/** Replaces the binary behind an existing asset, keeping its id and URL stable. */
export async function replaceMedia(asset: MediaAsset, file: File) {
  const { blob, mime, width, height, thumb } = await optimizeImage(file);
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(asset.storage_path, blob, { contentType: mime, upsert: true });
  if (error) throw error;
  if (thumb) {
    const base = asset.storage_path.replace(/\.[^.]+$/, '');
    await supabase.storage.from(MEDIA_BUCKET).upload(`${base}.thumb.webp`, thumb, { contentType: 'image/webp', upsert: true });
  }
  const { error: e2 } = await supabase
    .from('media_assets')
    .update({ file_name: file.name, file_size: blob.size, width, height, mime_type: mime })
    .eq('id', asset.id);
  if (e2) throw e2;
}

export const storageUsage = (assets: MediaAsset[]) => assets.reduce((sum, a) => sum + (a.file_size ?? 0), 0);

export const folderList = (assets: MediaAsset[]) =>
  Array.from(new Set(assets.map(a => a.folder || 'uploads'))).sort();
