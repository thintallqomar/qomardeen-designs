import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
}

interface CaseStudyNavProps {
  items: NavItem[];
}

const CaseStudyNav = ({ items }: CaseStudyNavProps) => {
  const [activeSection, setActiveSection] = useState(items[0]?.id || '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show nav after scrolling past hero (90vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.7);

      // Determine active section
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(items[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-1"
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`group flex items-center gap-3 py-1.5 transition-all duration-200 text-left ${
                activeSection === item.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground scale-100'
                }`}
              />
              <span
                className={`text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-primary translate-x-0'
                    : 'text-muted-foreground -translate-x-1 group-hover:translate-x-0'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default CaseStudyNav;
