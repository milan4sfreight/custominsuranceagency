import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import GetAQuote from "./pages/GetAQuote.tsx";
import TruckingInsurance from "./pages/TruckingInsurance.tsx";
import CommercialInsurance from "./pages/CommercialInsurance.tsx";
import FreightBrokerInsurance from "./pages/FreightBrokerInsurance.tsx";
import RiskManagement from "./pages/RiskManagement.tsx";
import About from "./pages/About.tsx";
import CompanyNews from "./pages/CompanyNews.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-a-quote" element={<GetAQuote />} />
          <Route path="/trucking-insurance" element={<TruckingInsurance />} />
          <Route path="/commercial-insurance" element={<CommercialInsurance />} />
          <Route path="/freight-broker-insurance" element={<FreightBrokerInsurance />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/about" element={<About />} />
          <Route path="/company-news" element={<CompanyNews />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
