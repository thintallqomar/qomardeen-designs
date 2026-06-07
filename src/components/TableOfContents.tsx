import { useCallback, useEffect, useMemo, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState('');

  const headings = useMemo(() => {
    const items: TocItem[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
      const match = line.match(/^(#{2,3})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`~\[\]()]/g, '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        items.push({ id, text, level });
      }
    }
    return items;
  }, [content]);

  // Determine the active heading based on scroll position.
  // Picks the last heading whose top has passed an offset line (~120px from top).
  const computeActive = useCallback(() => {
    const offset = 140;
    const positions = headings
      .map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return { id, top: el.getBoundingClientRect().top };
      })
      .filter((x): x is { id: string; top: number } => x !== null);

    if (positions.length === 0) return;

    // Find last heading whose top is at or above the offset line
    let current = positions[0].id;
    for (const p of positions) {
      if (p.top - offset <= 0) {
        current = p.id;
      } else {
        break;
      }
    }

    // If we're near the bottom of the page, snap to the last heading
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
      current = positions[positions.length - 1].id;
    }

    setActiveId(prev => (prev === current ? prev : current));
  }, [headings]);

  useEffect(() => {
    computeActive();
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        computeActive();
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [computeActive]);

  if (headings.length < 2) return null;

  return (
    <nav className="hidden lg:block sticky top-24 w-56 shrink-0 self-start" aria-label="Table of contents">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block text-xs leading-relaxed transition-colors border-l-2 -ml-px ${
                item.level === 3 ? 'pl-6' : 'pl-4'
              } ${
                activeId === item.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
