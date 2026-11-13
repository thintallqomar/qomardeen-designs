import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import AboutSection from '@/components/About';
import DesignPhilosophy from '@/components/DesignPhilosophy';

const About = () => {
    return (
    <>
      <Navigation />
      <PageSEO
        title="About — Qomardeen Tijani, Product Designer"
        description="Background, education, and design philosophy of Qomardeen Tijani — a Product Designer focused on SaaS, fintech, and AI-native products."
        path="/about"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <AboutSection />
            <DesignPhilosophy />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default About;
