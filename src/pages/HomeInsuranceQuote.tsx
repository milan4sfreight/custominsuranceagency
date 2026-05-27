import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const HomeInsuranceQuote = () => (
  <main className="min-h-screen bg-white font-['Inter',sans-serif]">
    <SEO title="Home Insurance Quote | Custom Insurance Agency" description="Get a free home insurance quote." />
    <Navbar />
    <section className="px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-[#0d2b2b]">Home Insurance Quote</h1>
      <p className="mt-3 text-[#4a5568]">Coming soon.</p>
    </section>
    <Footer />
  </main>
);

export default HomeInsuranceQuote;