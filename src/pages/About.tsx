import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import AboutSection from '@/components/About';
import DesignPhilosophy from '@/components/DesignPhilosophy';
import WhyImAGoodFit from '@/components/WhyImAGoodFit';

const About = () => {
    return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <AboutSection />
            <DesignPhilosophy />
            <WhyImAGoodFit />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default About;
