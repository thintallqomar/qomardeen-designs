import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UptimeProject from "./pages/UptimeProject";
import WalPayProject from "./pages/WalPayProject";
import Architecture from "./pages/Architecture";
import Blog from "./pages/Blog";
import Thinking from "./pages/Thinking";
import Hire from "./pages/Hire";
import NotFound from "./pages/NotFound";
import { useVisitorTracking } from "./hooks/useVisitorTracking";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  useVisitorTracking();
  
  return (
    <AnimatePresence mode="wait">
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
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
