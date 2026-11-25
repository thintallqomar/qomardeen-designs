/**
 * Qomardeen's mark: a lowercase "q" and "t" that share one stem, closed with a dot.
 * The strokes follow the text colour (light and dark mode); the dot uses the brand colour.
 */
const BrandMark = ({ className = 'h-7 w-auto', title }: { className?: string; title?: string }) => (
  <svg
    viewBox="0 0 50 48"
    fill="none"
    className={className}
    role={title ? 'img' : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
    focusable="false"
  >
    <circle cx="15" cy="24" r="10.5" stroke="currentColor" strokeWidth="6" />
    <path d="M25.5 5v39M25.5 13.5h11" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="44" cy="34" r="3.5" fill="hsl(var(--primary))" />
  </svg>
);

export default BrandMark;
