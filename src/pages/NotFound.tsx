import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageIntro from '@/components/PageIntro';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';

/** Shown for any address that doesn't exist, in every language. Same opening as every other page. */
const NotFound = () => {
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <PageIntro
                  word="404"
                  lead="This page doesn't exist or has moved. Here are the places most people are looking for."
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={localizedPath('/projects')} className="btn-primary">
                    See projects <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                  <Link to={localizedPath('/hire')} className="btn-outline">Hire Qomardeen</Link>
                  <button type="button" onClick={() => navigate(-1)} className="btn-outline">
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> Go back
                  </button>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default NotFound;
