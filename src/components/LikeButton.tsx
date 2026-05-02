import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useArticleLikes } from '@/hooks/useArticleLikes';
import { cn } from '@/lib/utils';
import IconTooltip from '@/components/IconTooltip';

interface LikeButtonProps {
  articleSlug: string;
}

const LikeButton = ({ articleSlug }: LikeButtonProps) => {
  const { count, liked, loading, pending, toggle } = useArticleLikes(articleSlug);

  return (
    <IconTooltip label={liked ? 'Unlike this article' : 'Like this article'}>
      <motion.button
      type="button"
      onClick={toggle}
      disabled={loading || pending}
      whileTap={{ scale: 0.92 }}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike this article' : 'Like this article'}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        liked
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30',
      )}
    >
      <motion.span
        key={liked ? 'on' : 'off'}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="inline-flex"
      >
        <Heart
          className={cn('w-4 h-4', liked && 'fill-current')}
          strokeWidth={2}
        />
      </motion.span>
      <span className="font-medium tabular-nums">{count}</span>
      <span className="text-xs text-muted-foreground/80 hidden sm:inline">
        {count === 1 ? 'like' : 'likes'}
      </span>
      </motion.button>
    </IconTooltip>
  );
};

export default LikeButton;