import cvAsset from '@/assets/Qomardeen_Tijani_CV.pdf.asset.json';

export const CV_FILENAME = 'Qomardeen_Tijani_CV.pdf';

/**
 * Where the CV can come from, in order:
 *  1. /Qomardeen_Tijani_CV.pdf: the file in the project's `public` folder (served by your own site,
 *     so it works in the preview and on the live site).
 *  2. The Lovable-hosted asset (only reachable on the live site).
 */
const CANDIDATES = ['/Qomardeen_Tijani_CV.pdf', cvAsset.url];

/**
 * Loads the CV as a Blob (never by opening the file address: the asset host sends a strict
 * security header, so a direct link shows "ERR_BLOCKED_BY_RESPONSE"). Returns null if none work.
 */
export async function fetchCvBlob(): Promise<Blob | null> {
  for (const url of CANDIDATES) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) continue;
      const raw = await res.blob();
      // Some hosts answer unknown file names with the web page itself; only accept a real PDF.
      const head = new TextDecoder().decode(await raw.slice(0, 5).arrayBuffer());
      if (head !== '%PDF-') continue;
      return new Blob([raw], { type: 'application/pdf' });
    } catch {
      /* try the next source */
    }
  }
  return null;
}

/** Saves the CV to the visitor's device. Returns false if it could not be loaded. */
export async function downloadCv(): Promise<boolean> {
  const blob = await fetchCvBlob();
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = CV_FILENAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return true;
}
