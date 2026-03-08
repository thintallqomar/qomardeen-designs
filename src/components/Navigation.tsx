import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, ChevronDown, Compass, Brain, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { supportedLanguages, languageNames, languageFlags, type SupportedLanguage } from '@/i18n';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const localizedPath = useLocalizedPath();
  const currentLang = (lang || i18n.language?.slice(0, 2) || 'en') as SupportedLanguage;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const mainNavItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.hire'), href: '/hire' },
  ];

  const exploreItems = [
    { name: t('nav.architecture'), href: '/architecture', icon: <Compass className="w-4 h-4 text-primary" />, desc: t('nav.architectureDesc', { defaultValue: 'System design & patterns' }) },
    { name: t('nav.thinking'), href: '/thinking', icon: <Brain className="w-4 h-4 text-primary" />, desc: t('nav.thinkingDesc', { defaultValue: 'Essays & frameworks' }) },
    { name: t('nav.about'), href: '/about', icon: <User className="w-4 h-4 text-primary" />, desc: t('nav.aboutDesc', { defaultValue: 'Background & experience' }) },
  ];

  const allMobileItems = [
    ...mainNavItems,
    ...exploreItems.map(i => ({ name: i.name, href: i.href })),
  ];

  const isActive = (href: string) => {
    const currentPath = location.pathname.replace(/^\/(en|fr|es)/, '') || '/';
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  };

  const isExploreActive = exploreItems.some(item => isActive(item.href));

  const switchLanguage = (newLang: SupportedLanguage) => {
    const currentPath = location.pathname.replace(/^\/(en|fr|es)/, '') || '';
    i18n.changeLanguage(newLang);
    navigate(`/${newLang}${currentPath}`);
    setLangOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to={localizedPath('/')} className="flex items-center gap-2 group shrink-0">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-105">
              <rect x="2" y="2" width="44" height="44" rx="12" className="fill-primary/10 stroke-primary" strokeWidth="2.5"/>
              <path d="M14 14h8v8h-8z" className="fill-primary" rx="2"/>
              <path d="M26 14h8v8h-8z" className="fill-primary/60" rx="2"/>
              <path d="M14 26h8v8h-8z" className="fill-primary/60" rx="2"/>
              <path d="M26 26h8v8H30l-4-4v-4z" className="fill-primary" rx="2"/>
              <path d="M34 34l4 4" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Design</span>
              <span className="text-foreground">Qit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map(item => (
              <Link
                key={item.name}
                to={localizedPath(item.href)}
                className={`relative px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive(item.href) ? 'text-primary font-medium' : 'text-foreground hover:text-primary hover:bg-secondary/50'}`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </Link>
            ))}

            {/* Explore Mega Dropdown */}
            <div
              className="relative"
              ref={exploreRef}
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${isExploreActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary hover:bg-secondary/50'}`}
              >
                {t('nav.explore', { defaultValue: 'Explore' })}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
                {isExploreActive && !exploreOpen && (
                  <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>
              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-full mt-3 w-[280px] bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {exploreItems.map((item) => (
                        <Link
                          key={item.href}
                          to={localizedPath(item.href)}
                          onClick={() => setExploreOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${isActive(item.href) ? 'bg-primary/10 text-primary' : 'hover:bg-secondary/70'}`}
                        >
                          <div className="p-2 rounded-lg bg-primary/10 shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${isActive(item.href) ? 'text-primary' : 'text-foreground'}`}>{item.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Spacer */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors text-sm"
                aria-label="Change language"
              >
                <Globe size={15} />
                <span className="text-xs font-medium uppercase">{currentLang}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px] z-50"
                  >
                    {supportedLanguages.map((lng) => (
                      <button
                        key={lng}
                        onClick={() => switchLanguage(lng)}
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${currentLang === lng ? 'text-primary font-medium bg-primary/5' : 'text-foreground'}`}
                      >
                        <span>{languageFlags[lng]}</span>
                        <span>{languageNames[lng]}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              whileTap={{ scale: 0.9, rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={theme} initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.2 }}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => { setLangOpen(!langOpen); setIsOpen(false); }}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors flex items-center gap-1"
            >
              <Globe size={15} />
              <span className="text-xs font-medium uppercase">{currentLang}</span>
            </button>
            <motion.button onClick={toggleTheme} className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors" whileTap={{ scale: 0.9 }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            <button onClick={() => { setIsOpen(!isOpen); setLangOpen(false); }} className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:text-primary hover:bg-secondary transition-colors" aria-label={isOpen ? 'Close menu' : 'Open menu'}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Language Dropdown */}
        <AnimatePresence>
          {langOpen && (
            <motion.div
              className="md:hidden absolute right-4 top-14 bg-background border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px] z-50"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {supportedLanguages.map((lng) => (
                <button
                  key={lng}
                  onClick={() => switchLanguage(lng)}
                  className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${currentLang === lng ? 'text-primary font-medium bg-primary/5' : 'text-foreground'}`}
                >
                  <span>{languageFlags[lng]}</span>
                  <span>{languageNames[lng]}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div className="md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="px-2 pt-2 pb-3 space-y-0.5 bg-background border-t border-border">
                {allMobileItems.map((item, index) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04, duration: 0.2 }}>
                    <Link
                      to={localizedPath(item.href)}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive(item.href) ? 'text-primary font-medium bg-secondary' : 'text-foreground hover:text-primary hover:bg-secondary/50'}`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
