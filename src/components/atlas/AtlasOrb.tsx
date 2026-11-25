/**
 * Atlas's mark: a core with three bodies on tilted orbits.
 * idle → drifts slowly · thinking → orbits speed up · speaking → the core pulses.
 * Motion stops for people who prefer reduced motion (see .atlas-orb rules in index.css).
 */
export type OrbState = 'idle' | 'thinking' | 'speaking';

const AtlasOrb = ({ size = 32, state = 'idle', className = '' }: { size?: number; state?: OrbState; className?: string }) => (
  <span
    className={`atlas-orb relative inline-grid place-items-center shrink-0 rounded-full ${className}`}
    data-state={state}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 40 40" width={size} height={size} className="overflow-visible">
      <defs>
        <radialGradient id="atlas-core" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="hsl(var(--primary) / 0.08)" />
      <g className="atlas-orb-ring atlas-orb-ring-a">
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="hsl(var(--primary) / 0.45)" strokeWidth="1" />
        <circle cx="36" cy="20" r="2" fill="hsl(var(--primary))" />
      </g>
      <g className="atlas-orb-ring atlas-orb-ring-b">
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" transform="rotate(60 20 20)" />
        <circle cx="12" cy="6.15" r="1.6" fill="hsl(var(--foreground) / 0.7)" />
      </g>
      <g className="atlas-orb-ring atlas-orb-ring-c">
        <ellipse cx="20" cy="20" rx="16" ry="6.5" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" transform="rotate(-60 20 20)" />
        <circle cx="12" cy="33.85" r="1.4" fill="hsl(var(--primary) / 0.8)" />
      </g>
      <circle className="atlas-orb-core" cx="20" cy="20" r="5.5" fill="url(#atlas-core)" />
    </svg>
  </span>
);

export default AtlasOrb;
