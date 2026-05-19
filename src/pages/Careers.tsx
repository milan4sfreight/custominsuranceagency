import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const Careers = () => (
  <main className="min-h-screen bg-white font-['Barlow',sans-serif] flex flex-col">
    <SEO title="Careers | Custom Insurance Agency" description="Careers at Custom Insurance Agency — coming soon." />
    <Navbar />
    <section className="flex flex-1 items-center justify-center px-6 pt-32 pb-32 text-center">
      <h1 className="text-[44px] md:text-[64px] font-bold text-[#0d2b2b]">Coming Soon</h1>
    </section>
    <Footer />
  </main>
);

export default Careers;
