import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import DesignPhilosophy from '@/components/DesignPhilosophy';
import Skills from '@/components/Skills';
import Portfolio from '@/components/Portfolio';
import WhyImAGoodFit from '@/components/WhyImAGoodFit';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <About />
        <DesignPhilosophy />
        <Skills />
        <Portfolio />
        <WhyImAGoodFit />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
