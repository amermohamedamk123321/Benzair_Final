import "./global.css";
import React from 'react';

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./hooks/useAuth";
import { LocaleProvider } from "./hooks/useLocale";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import Products from "./pages/Products";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: any}> {
  constructor(props:any){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error:any) { return { hasError: true, error }; }
  componentDidCatch(error:any, info:any) { console.error('React ErrorBoundary caught:', error, info); }
  render(){ if (this.state.hasError) return (<div className="min-h-screen flex items-center justify-center"> <div className="max-w-xl p-6 rounded-lg bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700"> <h2 className="text-xl font-semibold mb-2">An error occurred</h2> <pre className="text-sm text-red-600">{String(this.state.error)}</pre> </div> </div>); return this.props.children; }
}

const App: React.FC = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocaleProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LocaleProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

// Global unhandled rejection handler: ignore AbortError to avoid noisy overlays
window.addEventListener('unhandledrejection', (event) => {
  try {
    const reason = event.reason;
    if (reason && reason.name === 'AbortError') {
      // prevent default overlay behavior
      event.preventDefault();
      console.debug('Ignored AbortError:', reason);
    }
  } catch (e) {
    // ignore
  }
});

window.addEventListener('error', (ev) => {
  try {
    if (ev && ev.error && ev.error.name === 'AbortError') {
      ev.preventDefault();
      console.debug('Ignored AbortError (error event)', ev.error);
    }
  } catch (e) {}
});

createRoot(document.getElementById("root")!).render(<App />);
