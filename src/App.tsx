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
import { useStaffAuth } from "./hooks/useStaffAuth";

// Lazy-load non-critical routes
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const UptimeProject = lazy(() => import("./pages/UptimeProject"));
const WalPayProject = lazy(() => import("./pages/WalPayProject"));
const Architecture = lazy(() => import("./pages/Architecture"));
const Thinking = lazy(() => import("./pages/Thinking"));
const Hire = lazy(() => import("./pages/Hire"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminContentList = lazy(() => import("./pages/admin/ContentList"));
const AdminContentEditor = lazy(() => import("./pages/admin/ContentEditor"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const ExploreHub = lazy(() => import("./pages/explore/ExploreHub"));
const ExploreSection = lazy(() => import("./pages/explore/ExploreSection"));
const ContentDetail = lazy(() => import("./pages/explore/ContentDetail"));

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

/** Permanent client-side redirect for retired paths (e.g. /blog -> /explore/articles). */
const PathRewrite = ({ from, to }: { from: string; to: string }) => {
  const location = useLocation();
  const rest = location.pathname.slice(from.length);
  return <Navigate to={`${to}${rest}${location.search}`} replace />;
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
          <Route path="thinking" element={<Thinking />} />
          <Route path="hire" element={<Hire />} />
          <Route path="article/:slug" element={<ArticlePage />} />

          {/* Explore knowledge hub */}
          <Route path="explore" element={<ExploreHub />} />
          <Route path="explore/:section" element={<ExploreSection />} />
          <Route path="explore/:section/:slug" element={<ContentDetail />} />

          {/* Blog migrated into Explore > Articles */}
          <Route path="blog" element={<Navigate to="../explore/articles" replace />} />
          <Route path="blog/:slug" element={<BlogSlugRedirect />} />
        </Routes>
      </LanguageSync>
    </Suspense>
  );
};

const BlogSlugRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`../explore/articles/${slug}`} replace />;
};

/** Route-level gate: every /admin route requires a server-verified staff session. */
const RequireStaff = ({ children }: { children: React.ReactNode }) => {
  const { loading, isStaff } = useStaffAuth();
  if (loading) return <PageLoader />;
  if (!isStaff) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
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
          <Route path="/blog" element={<PathRewrite from="/blog" to="/explore/articles" />} />
          <Route path="/blog/*" element={<PathRewrite from="/blog" to="/explore/articles" />} />
          <Route path="/explore" element={<LanguageRedirectWithPath />} />
          <Route path="/explore/*" element={<LanguageRedirectWithPath />} />
          <Route path="/thinking" element={<LanguageRedirectWithPath />} />
          <Route path="/hire" element={<LanguageRedirectWithPath />} />
          <Route path="/article/*" element={<LanguageRedirectWithPath />} />
          <Route path="/projects/*" element={<LanguageRedirectWithPath />} />
          
          {/* Localized routes */}
          <Route path="/:lang/*" element={<LocalizedRoutes />} />
          
          {/* Admin routes (not localized) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireStaff><AdminDashboard /></RequireStaff>} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/content/:typePath" element={<RequireStaff><AdminContentList /></RequireStaff>} />
          <Route path="/admin/content/:typePath/:id" element={<RequireStaff><AdminContentEditor /></RequireStaff>} />
          <Route path="/admin/media" element={<RequireStaff><AdminMediaLibrary /></RequireStaff>} />
          <Route path="/admin/analytics" element={<RequireStaff><AdminAnalytics /></RequireStaff>} />
          
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
