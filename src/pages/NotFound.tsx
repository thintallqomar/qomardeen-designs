import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

const ease = [0.25, 0.1, 0.25, 1] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <main className="text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={() => window.history.back()}
                  className="outline-btn inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease }}
                >
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </motion.button>
                <Link to="/">
                  <motion.div
                    className="modern-btn inline-flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease }}
                  >
                    <Home className="w-4 h-4" /> Home
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
        <Footer />
      </PageTransition>
    </>
  );
};

export default NotFound;
