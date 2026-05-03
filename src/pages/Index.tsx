import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import InsuranceStrip from "@/components/site/InsuranceStrip";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import CoverageGrid from "@/components/site/CoverageGrid";
import CtaBand from "@/components/site/CtaBand";
import ContactSection from "@/components/site/ContactSection";
import Footer from "@/components/site/Footer";
import siteBg from "@/assets/site-bg.png";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div
        className="relative isolate"
        style={{
          backgroundImage: `url(${siteBg})`,
          backgroundAttachment: "fixed",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* soft wash so text stays legible without hiding the photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.35) 0%, hsl(var(--background) / 0.2) 50%, hsl(var(--background) / 0.4) 100%)",
          }}
        />
        <div className="relative z-10">
          <InsuranceStrip />
          <WhyChooseUs />
          <CoverageGrid />
          <CtaBand />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Index;
