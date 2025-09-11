import { ArrowRight, Download } from 'lucide-react';
import profileImage from '@/assets/qomardeen-profile.jpg';

const Hero = () => {
  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center hero-gradient">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary-light rounded-full text-sm font-medium text-primary-dark">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Available for new opportunities
              </div>
              
              <h1 className="hero-text">
                Hi, I'm <br />
                <span className="text-primary">Qomardeen Tyler Tijani</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
                From Fashion to Tech: Crafting Human-Centered Digital Experiences
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Nigerian product designer transitioning from fashion design, bringing creativity, 
                attention to detail, and a unique perspective to digital product experiences.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToPortfolio}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                View Portfolio
                <ArrowRight size={20} />
              </button>
              
              <button 
                onClick={scrollToContact}
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                Contact Me
                <Download size={20} />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2+</div>
                <div className="text-sm text-muted-foreground">Years in Fashion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Career Transition</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Creative Ideas</div>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="relative lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-110"></div>
              <div className="relative bg-card rounded-3xl p-8 border border-border shadow-elegant">
                <img
                  src={profileImage}
                  alt="Qomardeen Tyler Tijani - Product Designer"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-lg animate-bounce">
              <span className="text-2xl">🎨</span>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-border p-4 rounded-full shadow-md">
              <span className="text-2xl">💡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;