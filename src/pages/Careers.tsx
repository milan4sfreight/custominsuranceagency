import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import footerBg from "@/assets/footer-bg.jpg";

const Careers = () => (
  <main className="min-h-screen bg-white font-['Barlow',sans-serif] flex flex-col">
    <SEO title="Careers | Custom Insurance Agency" description="Careers at Custom Insurance Agency — coming soon." />
    <Navbar />
    <section
      className="relative flex flex-1 items-center justify-center px-6 pt-32 pb-32 text-center"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(10,25,50,0.6)" }} />
      <h1 className="relative z-10 text-[44px] md:text-[64px] font-light text-white">Coming Soon</h1>
    </section>
    <Footer />
  </main>
);

export default Careers;
