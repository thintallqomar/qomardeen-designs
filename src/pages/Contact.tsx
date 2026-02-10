import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ContactSection from '@/components/Contact';

const Contact = () => {
    return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <ContactSection />
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Contact;
