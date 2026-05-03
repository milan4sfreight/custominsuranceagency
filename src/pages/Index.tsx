import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import InsuranceStrip from "@/components/site/InsuranceStrip";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import CoverageGrid from "@/components/site/CoverageGrid";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import Footer from "@/components/site/Footer";
import parallaxBg from "@/assets/parallax-bg.png";

const Index = () => {
  return (
    <main className="relative min-h-screen">
      {/* Site-wide parallax background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${parallaxBg})`,
          backgroundAttachment: "fixed",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-white/40 via-white/60 to-white/85"
      />
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
