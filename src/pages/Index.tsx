import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import InsuranceStrip from "@/components/site/InsuranceStrip";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import CoverageGrid from "@/components/site/CoverageGrid";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import Footer from "@/components/site/Footer";
import heroBg from "@/assets/hero-bg.png";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="relative">
        {/* Parallax background image behind all sections after the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundAttachment: "fixed",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 0.55,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.35) 0%, hsl(var(--background) / 0.25) 50%, hsl(var(--background) / 0.4) 100%)",
          }}
        />
        <InsuranceStrip />
        <WhyChooseUs />
        <CoverageGrid />
        <CtaBand />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
