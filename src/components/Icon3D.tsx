import { ReactNode } from 'react';

type Icon3DVariant = 'primary' | 'accent' | 'success' | 'warning' | 'rose' | 'amber' | 'violet' | 'teal' | 'blue' | 'emerald';
type Icon3DSize = 'sm' | 'md' | 'lg' | 'xl';

interface Icon3DProps {
  children: ReactNode;
  variant?: Icon3DVariant;
  size?: Icon3DSize;
  className?: string;
}

const sizeMap: Record<Icon3DSize, string> = {
  sm: 'w-9 h-9 rounded-xl',
  md: 'w-11 h-11 rounded-xl',
  lg: 'w-14 h-14 rounded-2xl',
  xl: 'w-16 h-16 rounded-2xl',
};

const iconSizeMap: Record<Icon3DSize, string> = {
  sm: '[&_svg]:w-4 [&_svg]:h-4',
  md: '[&_svg]:w-5 [&_svg]:h-5',
  lg: '[&_svg]:w-6 [&_svg]:h-6',
  xl: '[&_svg]:w-7 [&_svg]:h-7',
};

// Airbnb-inspired 3D icon gradients that work in both light and dark modes
const variantStyles: Record<Icon3DVariant, string> = {
  primary:
    'bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary)/0.35)] text-primary shadow-[0_4px_14px_-3px_hsl(var(--primary)/0.35),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  blue:
    'bg-gradient-to-br from-[hsl(210_90%_60%/0.15)] via-[hsl(210_90%_55%/0.25)] to-[hsl(220_85%_50%/0.4)] text-[hsl(210_90%_55%)] shadow-[0_4px_14px_-3px_hsl(210_90%_55%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  teal:
    'bg-gradient-to-br from-[hsl(185_70%_50%/0.15)] via-[hsl(185_70%_45%/0.25)] to-[hsl(185_80%_40%/0.4)] text-[hsl(185_70%_45%)] shadow-[0_4px_14px_-3px_hsl(185_70%_45%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  accent:
    'bg-gradient-to-br from-[hsl(260_70%_60%/0.15)] via-[hsl(260_70%_55%/0.25)] to-[hsl(270_75%_50%/0.4)] text-[hsl(260_70%_55%)] shadow-[0_4px_14px_-3px_hsl(260_70%_55%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  violet:
    'bg-gradient-to-br from-[hsl(280_65%_55%/0.15)] via-[hsl(280_65%_50%/0.25)] to-[hsl(290_70%_45%/0.4)] text-[hsl(280_65%_50%)] shadow-[0_4px_14px_-3px_hsl(280_65%_50%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  success:
    'bg-gradient-to-br from-[hsl(142_60%_45%/0.15)] via-[hsl(142_60%_40%/0.25)] to-[hsl(152_65%_35%/0.4)] text-[hsl(142_60%_40%)] shadow-[0_4px_14px_-3px_hsl(142_60%_40%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  emerald:
    'bg-gradient-to-br from-[hsl(160_60%_45%/0.15)] via-[hsl(160_60%_40%/0.25)] to-[hsl(170_65%_35%/0.4)] text-[hsl(160_60%_40%)] shadow-[0_4px_14px_-3px_hsl(160_60%_40%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  warning:
    'bg-gradient-to-br from-[hsl(38_85%_50%/0.15)] via-[hsl(38_85%_45%/0.25)] to-[hsl(30_90%_40%/0.4)] text-[hsl(38_85%_45%)] shadow-[0_4px_14px_-3px_hsl(38_85%_45%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  amber:
    'bg-gradient-to-br from-[hsl(45_90%_50%/0.15)] via-[hsl(45_90%_45%/0.25)] to-[hsl(40_95%_40%/0.4)] text-[hsl(45_90%_45%)] shadow-[0_4px_14px_-3px_hsl(45_90%_45%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
  rose:
    'bg-gradient-to-br from-[hsl(350_70%_55%/0.15)] via-[hsl(350_70%_50%/0.25)] to-[hsl(340_75%_45%/0.4)] text-[hsl(350_70%_50%)] shadow-[0_4px_14px_-3px_hsl(350_70%_50%/0.3),inset_0_1px_1px_hsl(0_0%_100%/0.15)]',
};

const Icon3D = ({ children, variant = 'primary', size = 'md', className = '' }: Icon3DProps) => {
  return (
    <div
      className={`
        relative flex items-center justify-center flex-shrink-0
        ${sizeMap[size]}
        ${iconSizeMap[size]}
        ${variantStyles[variant]}
        transition-transform duration-300 hover:scale-105
        before:absolute before:inset-0 before:rounded-[inherit]
        before:bg-gradient-to-b before:from-white/10 before:to-transparent
        before:pointer-events-none
        ${className}
      `}
      style={{
        transform: 'perspective(500px) rotateX(2deg)',
      }}
    >
      {children}
    </div>
  );
};

export default Icon3D;
