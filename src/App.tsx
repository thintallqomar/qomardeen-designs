import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AIAssistantWidget from "./components/AIAssistantWidget";
import { useVisitorTracking } from "./hooks/useVisitorTracking";
import { supportedLanguages, rtlLanguages, type SupportedLanguage } from "./i18n";

// Lazy-load non-critical routes
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const UptimeProject = lazy(() => import("./pages/UptimeProject"));
const WalPayProject = lazy(() => import("./pages/WalPayProject"));
const Architecture = lazy(() => import("./pages/Architecture"));
const Blog = lazy(() => import("./pages/Blog"));
const Thinking = lazy(() => import("./pages/Thinking"));
const Hire = lazy(() => import("./pages/Hire"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

// Syncs i18n language with the :lang param
const LanguageSync = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && supportedLanguages.includes(lang as SupportedLanguage) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    // Set RTL direction for Arabic
    const isRtl = rtlLanguages.includes((lang || 'en') as SupportedLanguage);
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang || 'en';
  }, [lang, i18n]);

  return <>{children}</>;
};

// Redirects bare paths to /:lang/ based on browser detection
const LanguageRedirect = () => {
  const { i18n } = useTranslation();
  const detectedLang = supportedLanguages.includes(i18n.language?.slice(0, 2) as SupportedLanguage)
    ? i18n.language.slice(0, 2)
    : 'en';
  return <Navigate to={`/${detectedLang}`} replace />;
};

const LanguageRedirectWithPath = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const detectedLang = supportedLanguages.includes(i18n.language?.slice(0, 2) as SupportedLanguage)
    ? i18n.language.slice(0, 2)
    : 'en';
  return <Navigate to={`/${detectedLang}${location.pathname}`} replace />;
};

const LocalizedRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <LanguageSync>
        <Routes>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/uptime" element={<UptimeProject />} />
          <Route path="projects/walpay" element={<WalPayProject />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="blog" element={<Blog />} />
          <Route path="thinking" element={<Thinking />} />
          <Route path="hire" element={<Hire />} />
          <Route path="article/:slug" element={<ArticlePage />} />
        </Routes>
      </LanguageSync>
    </Suspense>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useVisitorTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Root redirect */}
          <Route path="/" element={<LanguageRedirect />} />
          
          {/* Non-localized routes that need redirect */}
          <Route path="/projects" element={<LanguageRedirectWithPath />} />
          <Route path="/about" element={<LanguageRedirectWithPath />} />
          <Route path="/contact" element={<LanguageRedirectWithPath />} />
          <Route path="/architecture" element={<LanguageRedirectWithPath />} />
          <Route path="/blog" element={<LanguageRedirectWithPath />} />
          <Route path="/thinking" element={<LanguageRedirectWithPath />} />
          <Route path="/hire" element={<LanguageRedirectWithPath />} />
          
          {/* Localized routes */}
          <Route path="/:lang/*" element={<LocalizedRoutes />} />
          
          {/* Admin routes (not localized) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <AIAssistantWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
