import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays } from 'lucide-react';

/**
 * Mobile-only "Book a call" bar that slides up once the visitor scrolls past the top of the Hire page.
 * It sits below the chat bubble (z-40 vs z-50) and leaves the bottom-right corner free for it.
 */
const StickyHireBar = ({ bookUrl }: { bookUrl: string }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return createPortal(
    <div
      aria-hidden={!show}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md pl-4 pr-[9.5rem] pt-3 transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={show ? 0 : -1}
        className="btn-primary w-full !px-4 !py-3"
      >
        <CalendarDays className="w-4 h-4" />
        Book a call
      </a>
    </div>,
    document.body,
  );
};

export default StickyHireBar;
