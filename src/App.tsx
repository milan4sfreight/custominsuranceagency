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
import Careers from "./pages/Careers.tsx";
import Claims from "./pages/Claims.tsx";
import ClaimForm from "./pages/ClaimForm.tsx";
import Resources from "./pages/Resources.tsx";
import Contact from "./pages/Contact.tsx";
import ClientLogin from "./pages/ClientLogin.tsx";
import OccAccidentEnrollment from "./pages/OccAccidentEnrollment.tsx";
import PDNTLApplication from "./pages/PDNTLApplication.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import PersonalLines from "./pages/PersonalLines.tsx";
import CommercialLines from "./pages/CommercialLines.tsx";
import OtherForms from "./pages/OtherForms.tsx";
import MotorcycleInsuranceQuote from "./pages/MotorcycleInsuranceQuote.tsx";
import BoatInsuranceQuote from "./pages/BoatInsuranceQuote.tsx";
import RVInsuranceQuote from "./pages/RVInsuranceQuote.tsx";
import FloodInsuranceQuote from "./pages/FloodInsuranceQuote.tsx";
import RentersInsuranceQuote from "./pages/RentersInsuranceQuote.tsx";
import SnowmobileInsuranceQuote from "./pages/SnowmobileInsuranceQuote.tsx";
import PolicyServices from "./pages/PolicyServices.tsx";
import EndorsementForm from "./pages/EndorsementForm.tsx";
import CancellationForm from "./pages/CancellationForm.tsx";
import AutoInsuranceQuote from "./pages/AutoInsuranceQuote.tsx";
import HealthInsuranceQuote from "./pages/HealthInsuranceQuote.tsx";
import HomeInsuranceQuote from "./pages/HomeInsuranceQuote.tsx";
import PayNow from "./pages/PayNow.tsx";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/get-a-quote" element={<GetAQuote />} />
          <Route path="/trucking-insurance" element={<TruckingInsurance />} />
          <Route path="/commercial-insurance" element={<CommercialInsurance />} />
          <Route path="/freight-broker-insurance" element={<FreightBrokerInsurance />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/about" element={<About />} />
          <Route path="/company-news" element={<CompanyNews />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/claims/file-a-claim" element={<ClaimForm />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/occ-accident-enrollment" element={<OccAccidentEnrollment />} />
          <Route path="/pd-ntl-application" element={<PDNTLApplication />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/personal-lines" element={<PersonalLines />} />
          <Route path="/commercial-lines" element={<CommercialLines />} />
          <Route path="/other-forms" element={<OtherForms />} />
          <Route path="/motorcycle-insurance-quote" element={<MotorcycleInsuranceQuote />} />
          <Route path="/boat-insurance-quote" element={<BoatInsuranceQuote />} />
          <Route path="/rv-insurance-quote" element={<RVInsuranceQuote />} />
          <Route path="/flood-insurance-quote" element={<FloodInsuranceQuote />} />
          <Route path="/renters-insurance-quote" element={<RentersInsuranceQuote />} />
          <Route path="/snowmobile-insurance-quote" element={<SnowmobileInsuranceQuote />} />
          <Route path="/policy-services" element={<PolicyServices />} />
          <Route path="/policy-services/endorse" element={<EndorsementForm />} />
          <Route path="/policy-services/cancel" element={<CancellationForm />} />
          <Route path="/auto-insurance-quote" element={<AutoInsuranceQuote />} />
          <Route path="/health-insurance-quote" element={<HealthInsuranceQuote />} />
          <Route path="/home-insurance-quote" element={<HomeInsuranceQuote />} />
          <Route path="/pay-now" element={<PayNow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BackToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
