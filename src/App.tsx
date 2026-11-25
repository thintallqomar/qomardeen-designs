import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { startScrambleHeadings } from "@/lib/scramble";
import { useHiddenProjects } from "@/hooks/useSiteSettings";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AIAssistantWidget from "./components/AIAssistantWidget";
import { useVisitorTracking } from "./hooks/useVisitorTracking";
import { supportedLanguages, rtlLanguages, type SupportedLanguage } from "./i18n";
import { useStaffAuth } from "./hooks/useStaffAuth";
import { fetchBySlug } from "./lib/cms";

// Lazy-load non-critical routes
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const UptimeProject = lazy(() => import("./pages/UptimeProject"));
const WalPayProject = lazy(() => import("./pages/WalPayProject"));
const FragranceProject = lazy(() => import("./pages/FragranceProject"));
const PortfolioProject = lazy(() => import("./pages/PortfolioProject"));
const CaseStudyPage = lazy(() => import("./pages/CaseStudyPage"));
const Architecture = lazy(() => import("./pages/Architecture"));
const Thinking = lazy(() => import("./pages/Thinking"));
const Hire = lazy(() => import("./pages/Hire"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminContentList = lazy(() => import("./pages/admin/ContentList"));
const AdminContentEditor = lazy(() => import("./pages/admin/ContentEditor"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const AdminAtlasHistory = lazy(() => import("./pages/admin/AtlasHistory"));
const AdminInquiries = lazy(() => import("./pages/admin/Inquiries"));
const AdminSiteSettings = lazy(() => import("./pages/admin/SiteSettings"));
const AdminAboutEditor = lazy(() => import("./pages/admin/AboutEditor"));
const AdminSecurity = lazy(() => import("./pages/admin/Security"));
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

  const valid = !!lang && supportedLanguages.includes(lang as SupportedLanguage);

  useEffect(() => {
    if (valid && i18n.language !== lang) {
      i18n.changeLanguage(lang!);
    }
    // Set RTL direction for Arabic
    const current = valid ? lang! : 'en';
    document.documentElement.dir = rtlLanguages.includes(current as SupportedLanguage) ? 'rtl' : 'ltr';
    document.documentElement.lang = current;
  }, [lang, valid, i18n]);

  // "/zzz" isn't a language: show "not found" instead of treating it as one and showing Home.
  if (!valid) return <NotFound />;
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

// The Contact page now lives at the bottom of Hire. Old /contact links land on that section.
const ContactRedirect = () => {
  const { lang } = useParams<{ lang: string }>();
  return <Navigate to={`/${lang || 'en'}/hire#contact`} replace />;
};

const LanguageRedirectWithPath = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const detectedLang = supportedLanguages.includes(i18n.language?.slice(0, 2) as SupportedLanguage)
    ? i18n.language.slice(0, 2)
    : 'en';
  return <Navigate to={`/${detectedLang}${location.pathname}${location.search}${location.hash}`} replace />;
};

/** Permanent client-side redirect for retired paths (e.g. /blog -> /explore/articles). */
const PathRewrite = ({ from, to }: { from: string; to: string }) => {
  const location = useLocation();
  const rest = location.pathname.slice(from.length);
  return <Navigate to={`${to}${rest}${location.search}`} replace />;
};

/**
 * UpTime and WalPay started life as fixed pages. Once they are imported into the admin
 * (and published) the editable version is shown; until then the original page is used,
 * so nothing breaks.
 */
const ProjectRoute = ({ slug, Legacy }: { slug: string; Legacy: React.ComponentType }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: () => fetchBySlug('case_study', slug),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  // If the database is slow or unreachable, show the built-in page after 2.5s instead of a spinner.
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setWaitedTooLong(true), 2500);
    return () => clearTimeout(id);
  }, []);
  const hidden = useHiddenProjects();
  if (isLoading && !waitedTooLong) return <PageLoader />;
  // Switched off in the admin: show the friendly "not available" page instead of the built-in one.
  if (hidden.has(slug)) return <CaseStudyPage slug={slug} />;
  const live = !!data && data.status === 'published' && data.visibility === 'public';
  return live ? <CaseStudyPage slug={slug} /> : <Legacy />;
};

const LocalizedRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <LanguageSync>
        <Routes>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/uptime" element={<ProjectRoute slug="uptime" Legacy={UptimeProject} />} />
          <Route path="projects/walpay" element={<ProjectRoute slug="walpay" Legacy={WalPayProject} />} />
          <Route path="projects/portfolio" element={<ProjectRoute slug="portfolio" Legacy={PortfolioProject} />} />
          <Route path="projects/fragrance" element={<ProjectRoute slug="fragrance" Legacy={FragranceProject} />} />
          <Route path="projects/:slug" element={<CaseStudyPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactRedirect />} />
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

          {/* Anything else under a language (a typo, an old link) gets the real "not found" page, not a blank screen */}
          <Route path="*" element={<NotFound />} />
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
  const { loading, isStaff, needsMfa } = useStaffAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  // Password done but no authenticator code yet: back to sign-in, which asks for the code.
  if (needsMfa) return <Navigate to={`/admin/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!isStaff) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  useVisitorTracking();
  useEffect(() => startScrambleHeadings(), []);

  const lastPath = useRef(location.pathname);
  useEffect(() => {
    const pageChanged = lastPath.current !== location.pathname;
    lastPath.current = location.pathname;
    if (!location.hash) {
      if (pageChanged) window.scrollTo(0, 0);
      return;
    }
    // Links like /hire#contact: open the page, then glide to that section once it exists.
    if (pageChanged) window.scrollTo(0, 0);
    const id = decodeURIComponent(location.hash.slice(1));
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const go = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 30) timer = setTimeout(go, 100);
    };
    timer = setTimeout(go, pageChanged ? 500 : 0);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);
  
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
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route path="/admin" element={<RequireStaff><AdminDashboard /></RequireStaff>} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/content/:typePath" element={<RequireStaff><AdminContentList /></RequireStaff>} />
          <Route path="/admin/content/:typePath/:id" element={<RequireStaff><AdminContentEditor /></RequireStaff>} />
          <Route path="/admin/media" element={<RequireStaff><AdminMediaLibrary /></RequireStaff>} />
          <Route path="/admin/site" element={<RequireStaff><AdminSiteSettings /></RequireStaff>} />
          <Route path="/admin/about" element={<RequireStaff><AdminAboutEditor /></RequireStaff>} />
          <Route path="/admin/security" element={<RequireStaff><AdminSecurity /></RequireStaff>} />
          <Route path="/admin/inquiries" element={<RequireStaff><AdminInquiries /></RequireStaff>} />
          <Route path="/admin/atlas" element={<RequireStaff><AdminAtlasHistory /></RequireStaff>} />
          <Route path="/admin/atlas/:threadId" element={<RequireStaff><AdminAtlasHistory /></RequireStaff>} />
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
