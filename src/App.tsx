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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import TradelineMarketplace from "./pages/TradelineMarketplace";
import TradelineCalculatorPage from "./pages/TradelineCalculatorPage";
import SSNValidatorPage from "./pages/SSNValidatorPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

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
              <Route path="/calculator" element={<TradelineCalculatorPage />} />
              <Route path="/ssn-validator" element={<SSNValidatorPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
