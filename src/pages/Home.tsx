import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <Skills />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;
