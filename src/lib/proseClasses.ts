/**
 * One shared look for long-form text (articles, blogs, thinking, architecture, resources).
 * Used by BOTH the admin editor and the public page, so what you see while writing is what visitors get.
 * (Tailwind's base reset removes bullets, numbers and heading sizes, so they are set here explicitly.)
 */
export const ARTICLE_PROSE = [
  'text-base leading-relaxed text-foreground/90',
  '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4',
  '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3',
  '[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2',
  '[&_p]:mb-5',
  '[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:mb-5 [&_ol]:mb-5',
  '[&_li]:mb-1.5 [&_li>p]:mb-0',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-5',
  '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
  '[&_strong]:font-semibold [&_strong]:text-foreground',
  '[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-secondary [&_pre]:p-4 [&_pre]:mb-5 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_hr]:my-8 [&_hr]:border-border',
  '[&_table]:w-full [&_table]:border-collapse [&_table]:mb-5 [&_table]:text-sm',
  '[&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:px-3 [&_th]:py-2 [&_th]:text-left',
  '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2',
  '[&_img]:rounded-xl [&_img]:max-w-full [&_img]:h-auto',
  '[&_figure]:my-6',
].join(' ');
