import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import InsuranceStrip from "@/components/site/InsuranceStrip";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import CoverageGrid from "@/components/site/CoverageGrid";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <InsuranceStrip />
      <WhyChooseUs />
      <CoverageGrid />
      <CtaBand />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
