import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityHeaders } from "@/components/SecurityHeaders";
import { useCSRF } from "@/hooks/useCSRF";
import { useSecurityMonitor } from "@/hooks/useSecurityMonitor";
import Index from "./pages/Index";
import TradelineMarketplace from "./pages/TradelineMarketplace";
import ProductDetail from "./pages/ProductDetail";
import TradelineCalculatorPage from "./pages/TradelineCalculatorPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Team from "./pages/Team";
import Press from "./pages/Press";
import CPNPackages from "./pages/CPNPackages";
import BusinessCredit from "./pages/BusinessCredit";
import CreditRepair from "./pages/CreditRepair";
import Contact from "./pages/Contact";
import LiveChat from "./pages/LiveChat";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Compliance from "./pages/Compliance";
import TypesOfTradelines from "./pages/TypesOfTradelines";

const queryClient = new QueryClient();

const App = () => {
  // Initialize security systems
  useCSRF();
  useSecurityMonitor();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <SecurityHeaders />
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tradelines" element={<TradelineMarketplace />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/calculator" element={<TradelineCalculatorPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Company Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/press" element={<Press />} />
              
              {/* Service Pages */}
              <Route path="/cpn-packages" element={<CPNPackages />} />
              <Route path="/business-credit" element={<BusinessCredit />} />
              <Route path="/credit-repair" element={<CreditRepair />} />
              <Route path="/types-of-tradelines" element={<TypesOfTradelines />} />
              
              {/* Support Pages */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/live-chat" element={<LiveChat />} />
              
              {/* Legal Pages */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/compliance" element={<Compliance />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
