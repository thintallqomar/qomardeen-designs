/**
 * Links that come from the admin (case study live links, downloads, rich text) are checked
 * before they reach a visitor: only web, email, phone and on-site addresses are allowed.
 * This blocks "javascript:" and "data:" links, which could run code in a visitor's browser
 * if an admin account were ever misused.
 */
export const safeHref = (href: unknown): string | undefined =>
  typeof href === 'string' && /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href.trim()) ? href.trim() : undefined;

/** Images may only come from http(s) or this site. */
export const safeSrc = (src: unknown): string | undefined =>
  typeof src === 'string' && /^(https?:\/\/|\/(?!\/)|blob:)/i.test(src.trim()) ? src.trim() : undefined;
