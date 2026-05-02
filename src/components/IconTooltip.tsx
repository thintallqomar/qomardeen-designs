import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface IconTooltipProps {
  /** Text displayed in the tooltip and read by screen readers via aria-label fallback. */
  label: string;
  /** A single focusable child (button, anchor, motion.button, etc.). Must accept refs. */
  children: ReactNode;
  /** Tooltip side. Defaults to "top". */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing, in ms. */
  delayDuration?: number;
}

/**
 * Universal tooltip wrapper for icon-only controls across the app.
 * Usage:
 *   <IconTooltip label="Share on Twitter">
 *     <a href="..." aria-label="Share on Twitter"><Twitter /></a>
 *   </IconTooltip>
 */
const IconTooltip = ({ label, children, side = 'top', delayDuration = 200 }: IconTooltipProps) => (
  <Tooltip delayDuration={delayDuration}>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} className="text-xs">
      {label}
    </TooltipContent>
  </Tooltip>
);

export default IconTooltip;