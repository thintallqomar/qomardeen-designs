import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Heart } from 'lucide-react';
import profileImage from '@/assets/new-profile.jpg';

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section id="home" className="min-h-screen flex items-center hero-gradient relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-40 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
        
        {/* Geometric shapes */}
        <div className="floating-element absolute top-1/3 right-10 w-24 h-24 border border-primary/20 rounded-lg rotate-45 blur-sm"></div>
        <div className="floating-element absolute bottom-1/3 left-16 w-12 h-12 bg-gradient-primary rounded-full opacity-20"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 flex flex-col justify-center h-full max-h-[500px]">
            {/* Status Badge */}
            <div className="inline-flex items-center px-5 py-2.5 hero-badge rounded-full text-sm font-semibold text-primary-dark animate-pulse w-fit">
              <div className="w-2.5 h-2.5 bg-success rounded-full mr-2.5 animate-ping"></div>
              <Sparkles className="w-4 h-4 mr-2" />
              Available for new opportunities
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="hero-name animate-fade-in">
                  Qomardeen Tyler Tijani
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold text-primary">
                  Product Designer (UI/UX)
                </h2>
              </div>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                I design intuitive, scalable digital products by combining user research, visual clarity, and structured problem-solving.
              </p>
              
              <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                Experience delivering live products across dashboards, SaaS platforms, landing pages, and system-driven interfaces.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={() => navigate('/projects')} className="modern-btn inline-flex items-center justify-center gap-2.5 group">
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                View Case Studies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button onClick={() => navigate('/contact')} className="outline-btn inline-flex items-center justify-center gap-2.5 group">
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Contact Me
              </button>
            </div>

            {/* Skills Preview Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['UI Design', 'UX Research', 'Product Design', 'Design Systems', 'Dashboards'].map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Profile Section */}
          <div className="relative lg:order-2">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-20 scale-110 group-hover:opacity-30 transition-opacity"></div>
                <div className="glass-card p-8 relative">
                  <img src={profileImage} alt="Qomardeen Tyler Tijani - Product Designer" className="w-full max-h-[420px] object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Overlay gradient */}
                  <div className="absolute left-8 right-8 bottom-8 top-[45%] rounded-2xl bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 glass-card p-4 animate-bounce">
                <div className="text-2xl">🎨</div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass-card p-4 floating-element">
                <div className="text-2xl">💡</div>
              </div>

              <div className="absolute top-1/4 -left-8 glass-card p-3 floating-element">
                <div className="text-xl">✨</div>
              </div>

              <div className="absolute bottom-1/4 -right-8 glass-card p-3 floating-element">
                <div className="text-xl">🚀</div>
              </div>
            </div>
            
            {/* Achievement Badge */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="glass-card px-6 py-3 text-center">
                <div className="text-sm font-semibold text-primary">Product Designer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
