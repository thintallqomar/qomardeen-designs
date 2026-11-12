/**
 * The soft brand-coloured glow behind the hero message (Home and Hire share it).
 *
 * The colour follows the theme automatically (teal in dark mode, deep blue in light mode,
 * via --primary). Strength is tuned per theme: the site marks light mode with a `.light`
 * class on <html> (Tailwind's `dark:` prefix is never active here), so light is targeted
 * explicitly. Adjust the two opacity values below to taste.
 */
const HeroGlow = ({ className = '' }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`absolute -top-1/4 -right-1/4 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none opacity-[0.18] [.light_&]:opacity-[0.14] ${className}`}
    style={{
      background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.8), transparent 70%)',
      filter: 'blur(80px)',
    }}
  />
);

export default HeroGlow;
