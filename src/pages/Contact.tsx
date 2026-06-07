import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ContactSection from '@/components/Contact';

const Contact = () => {
    return (
    <>
      <Navigation />
      <PageSEO
        title="Contact Qomardeen Tijani — Product Designer"
        description="Get in touch with Qomardeen Tijani for full-time roles, contract work, or collaborative product-design projects."
        path="/contact"
      />
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
