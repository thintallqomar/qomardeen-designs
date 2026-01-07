import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ContactSection from '@/components/Contact';

const Contact = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <ContactSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Contact;
