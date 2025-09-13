import { Heart, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com/in/qomardeen-tijani",
      label: "LinkedIn"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: "mailto:qomardeentylertijani@gmail.com",
      label: "Email"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      href: "tel:+2348139469192",
      label: "Phone"
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      href: "https://x.com/the_Qomardeen",
      label: "X (Twitter)"
    }
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  QTT
                </span>
                <span className="text-lg font-medium">Qomardeen Tyler Tijani</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                A Nigerian product designer transitioning from fashion design. 
                Crafting human-centered digital experiences with creativity and precision.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.href)}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Nigeria</div>
                <div>qomardeentylertijani@gmail.com</div>
                <div>+2348139469192</div>
              </div>
              
              <div className="mt-4 p-3 bg-secondary rounded-lg">
                <div className="text-sm font-medium text-foreground mb-1">
                  Available for opportunities
                </div>
                <div className="text-xs text-muted-foreground">
                  Open to freelance & full-time positions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} Qomardeen Tyler Tijani. All rights reserved.
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Got a complex challenge you're ready to tackle? I'm all ears. Let's dig in and craft a solution that's both intuitive and innovative.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;