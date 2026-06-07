import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import AnimatedMetrics from '@/components/AnimatedMetrics';
import DesignPhilosophy from '@/components/DesignPhilosophy';
import ArchitecturePreview from '@/components/ArchitecturePreview';
import AIAssistantPreview from '@/components/AIAssistantPreview';
import LatestInsights from '@/components/LatestInsights';
import HireCTA from '@/components/HireCTA';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';

const Home = () => {
    return (
    <>
      <Navigation />
      <PageSEO
        title="Qomardeen Tijani — Product Designer (UX, AI & Systems)"
        description="Portfolio of Qomardeen Tijani, a Product Designer building scalable digital products across fintech, SaaS, and AI-native tools."
        path="/"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <Hero />
            <AnimatedMetrics />
            <FeaturedProjects />
            <DesignPhilosophy />
            <ArchitecturePreview />
            <AIAssistantPreview />
            <LatestInsights />
            <HireCTA />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Home;
