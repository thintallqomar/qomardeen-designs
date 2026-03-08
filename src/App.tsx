import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AIAssistantWidget from "./components/AIAssistantWidget";
import { useVisitorTracking } from "./hooks/useVisitorTracking";

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
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/uptime" element={<UptimeProject />} />
          <Route path="/projects/walpay" element={<WalPayProject />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/thinking" element={<Thinking />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
