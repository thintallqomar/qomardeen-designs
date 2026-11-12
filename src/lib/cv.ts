import cvAsset from '@/assets/Qomardeen_Tijani_CV.pdf.asset.json';

export const CV_FILENAME = 'Qomardeen_Tijani_CV.pdf';

/**
 * Downloads the CV without navigating to the file.
 *
 * Why: the file host serves the PDF with a strict security header (CSP default-src 'none'),
 * so opening the PDF address directly (a plain link) shows "ERR_BLOCKED_BY_RESPONSE".
 * Fetching it here and saving it from a blob avoids that. Returns false if it fails.
 */
export async function downloadCv(): Promise<boolean> {
  try {
    const res = await fetch(cvAsset.url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = new Blob([await res.blob()], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = CV_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}
