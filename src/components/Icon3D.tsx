import { ReactNode } from 'react';

/**
 * The one icon tile used across the site (menus, About, Hire, Explore, forms).
 * Flat and quiet to match the rest of the design system: a soft brand tint, a hairline
 * edge, brand-coloured icon. No gradients, glows or hover zoom.
 *
 * Colour names from older code (blue, rose, violet…) all map to the brand colour, so the
 * site never shows a rainbow of tiles. Only meaningful status colours keep their own colour.
 */
type Icon3DVariant = 'primary' | 'accent' | 'success' | 'warning' | 'rose' | 'amber' | 'violet' | 'teal' | 'blue' | 'emerald';
type Icon3DSize = 'sm' | 'md' | 'lg' | 'xl';

interface Icon3DProps {
  children: ReactNode;
  variant?: Icon3DVariant;
  size?: Icon3DSize;
  className?: string;
}

const sizeMap: Record<Icon3DSize, string> = {
  sm: 'w-9 h-9 rounded-xl [&_svg]:w-4 [&_svg]:h-4',
  md: 'w-11 h-11 rounded-xl [&_svg]:w-5 [&_svg]:h-5',
  lg: 'w-14 h-14 rounded-2xl [&_svg]:w-6 [&_svg]:h-6',
  xl: 'w-16 h-16 rounded-2xl [&_svg]:w-7 [&_svg]:h-7',
};

const BRAND = 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/15';
const tone = (variant: Icon3DVariant) =>
  variant === 'success' ? 'bg-success/10 text-success ring-1 ring-inset ring-success/20'
  : variant === 'warning' ? 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20'
  : BRAND;

const Icon3D = ({ children, variant = 'primary', size = 'md', className = '' }: Icon3DProps) => (
  <div aria-hidden="true" className={`relative flex shrink-0 items-center justify-center ${sizeMap[size]} ${tone(variant)} ${className}`}>
    {children}
  </div>
);

export default Icon3D;
