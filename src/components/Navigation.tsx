import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [{
    name: 'Home',
    href: '#home'
  }, {
    name: 'About',
    href: '#about'
  }, {
    name: 'Skills',
    href: '#skills'
  }, {
    name: 'Portfolio',
    href: '#portfolio'
  }, {
    name: 'Contact',
    href: '#contact'
  }];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">DesignQit</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="nav-link"
              >
                {item.name}
              </button>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block px-3 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors w-full text-left"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;