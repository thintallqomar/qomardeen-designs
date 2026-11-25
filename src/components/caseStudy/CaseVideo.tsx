import { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

/**
 * A short, silent case study clip (for example, a phone screen scrolling).
 *
 * - Loads nothing until it is close to the screen (saves data on slow connections),
 *   plays while visible and pauses when scrolled away.
 * - People who turn motion off see the still poster and can press play.
 * - Always has a play/pause button and a full-screen button, so it never runs out of control.
 */
const CaseVideo = ({ src, poster, label, className = '', controls = false }: {
  src: string; poster: string; label: string; className?: string; controls?: boolean;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true);
      if (!e.isIntersecting) v.pause();
      else if (!reduce && !userPaused) void v.play().catch(() => { /* autoplay blocked: the poster and play button stay */ });
    }, { rootMargin: '200px 0px', threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, userPaused, near]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { setUserPaused(false); void v.play().catch(() => {}); }
    else { setUserPaused(true); v.pause(); }
  };
  const fullscreen = () => {
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (v.requestFullscreen) void v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${className}`}>
      <video
        ref={ref}
        src={near ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={controls && playing}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="block w-full h-auto"
      />
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause: ${label}` : `Play: ${label}`}
          className="grid h-11 w-11 place-items-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
        </button>
        <button
          type="button"
          onClick={fullscreen}
          aria-label={`Full screen: ${label}`}
          className="grid h-11 w-11 place-items-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CaseVideo;
