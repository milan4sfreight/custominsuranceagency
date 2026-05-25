import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

const barlow = { fontFamily: "'Barlow', sans-serif" };

const EndorsementForm = () => (
  <main className="min-h-screen bg-white font-['Inter',sans-serif]">
    <SEO title="Endorsement Request | Custom Insurance Agency" description="Submit an endorsement request online." />
    <Navbar />
    <section className="px-6 pt-32 pb-20 md:px-12">
      <div className="mx-auto max-w-[800px] text-center">
        <h1 className="text-[32px] md:text-[44px] font-bold text-[#0d2b2b]" style={barlow}>
          Endorsement Request
        </h1>
        <p className="mt-4 text-[15px] leading-[1.7] text-[#4a5568]">
          The online endorsement form is coming soon. In the meantime, please contact us to submit your request.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/contact" className="btn-quote inline-block px-8 py-3 text-[13px] uppercase tracking-wider">
            Contact Us
          </Link>
          <Link
            to="/policy-services"
            className="inline-block px-8 py-3 text-[13px] uppercase tracking-wider border border-[#2abfbf] text-[#2abfbf] rounded-full"
          >
            Back
          </Link>
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default EndorsementForm;