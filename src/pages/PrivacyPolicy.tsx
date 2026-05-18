import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SEO from "@/components/SEO";

type Section = {
  title: string;
  body?: string;
  bullets?: string[];
  after?: string;
  contact?: boolean;
};

const sections: Section[] = [
  {
    title: "Introduction",
    body: 'Custom Insurance Agency ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website custominsure.com, use our services, or interact with us through any channel including phone, email, social media, and third-party platforms.',
  },
  {
    title: "Information We Collect",
    body: "We may collect the following types of information:",
    bullets: [
      "Personal identification information (name, email address, phone number, mailing address)",
      "Business information (company name, DOT number, MC number, fleet details)",
      "Insurance-related information (vehicle details, driver information, coverage history)",
      "Technical data (IP address, browser type, pages visited, time spent on site)",
      "Communications data (emails, form submissions, chat logs, call recordings)",
    ],
  },
  {
    title: "How We Use Your Information",
    body: "We use the information we collect to:",
    bullets: [
      "Provide, operate, and improve our services",
      "Generate insurance quotes and process applications",
      "Communicate with you about your policy or inquiry",
      "Send you updates, newsletters, or promotional materials (with your consent)",
      "Comply with legal obligations and regulatory requirements",
      "Prevent fraud and ensure platform security",
      "Improve our website and user experience",
    ],
  },
  {
    title: "How We Share Your Information",
    body: "We may share your information with:",
    bullets: [
      "Insurance carriers and underwriters to obtain quotes and bind coverage on your behalf",
      "Third-party service providers who assist in operating our website and business (e.g. email platforms, CRM systems, analytics tools)",
      "Regulatory authorities when required by law",
      "Business partners with your explicit consent",
    ],
    after: "We do not sell your personal information to third parties.",
  },
  {
    title: "SMS and Text Message Communications",
    body: "By providing your mobile phone number and checking the SMS consent box on our website forms, you agree to receive text messages from Custom Insurance Agency. Your consent is voluntary and is not required as a condition of purchasing any product or service.",
    bullets: [
      "Program: We send SMS messages related to your insurance quote follow-up and application status updates",
      "Message frequency: Up to 3–5 messages per quote request during the follow-up process",
      "Message and data rates may apply depending on your mobile carrier and plan",
      "We do not share your SMS opt-in data or mobile number with third parties for marketing purposes",
      "Supported carriers include AT&T, Verizon, T-Mobile, Sprint, and most major U.S. carriers",
    ],
    after:
      "To opt out at any time, reply STOP to any message you receive from us. You will receive one final confirmation and will no longer receive SMS communications. For help, reply HELP or contact us at office@custominsure.com or 708-810-1955.",
  },
  {
    title: "Cookies and Tracking Technologies",
    body: "We use cookies and similar tracking technologies to enhance your browsing experience. You may control cookie settings through your browser. Types of cookies we use:",
    bullets: [
      "Essential cookies (required for site function)",
      "Analytics cookies (to understand site usage)",
      "Marketing cookies (to deliver relevant ads)",
    ],
  },
  {
    title: "Third-Party Platforms",
    body: "Our website may contain links to third-party sites including social media platforms (Facebook, Instagram, LinkedIn), review platforms, and partner websites. We are not responsible for the privacy practices of these platforms. We encourage you to review their privacy policies.",
  },
  {
    title: "Data Retention",
    body: "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.",
  },
  {
    title: "Your Rights",
    body: "Depending on your location, you may have the right to:",
    bullets: [
      "Access the personal information we hold about you",
      "Request correction of inaccurate data",
      "Request deletion of your personal information",
      "Opt out of marketing communications",
      "Lodge a complaint with a supervisory authority",
    ],
    after: "To exercise these rights, contact us at office@custominsure.com or 708-810-1955.",
  },
  {
    title: "Children's Privacy",
    body: "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.",
  },
  {
    title: "Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of our services after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "Contact Us",
    body: "If you have questions about this Privacy Policy or our data practices, please contact us:",
    contact: true,
  },
];

const PrivacyPolicy = () => {
  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <SEO
        title="Privacy Policy | Custom Insurance Agency"
        description="Read the Custom Insurance Agency privacy policy explaining how we collect, use, and protect your personal information."
      />
      <Navbar />

      <section
        style={{
          background: "linear-gradient(135deg, #0f2a42 0%, #173b5d 50%, #0d2b2b 100%)",
          paddingTop: 160,
          paddingBottom: 80,
          textAlign: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h1
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 700,
              fontSize: 48,
              color: "#ffffff",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              marginTop: 16,
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
            }}
          >
            Last updated: May 17, 2026
          </p>
        </div>
      </section>

      <section style={{ background: "#ffffff" }}>
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "64px 24px",
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#374151",
            lineHeight: 1.8,
          }}
        >
          {sections.map((s, i) => (
            <div
              key={i}
              style={{
                borderLeft: `4px solid ${s.title === "SMS and Text Message Communications" ? "#f5821f" : "#2abfbf"}`,
                paddingLeft: 20,
                marginBottom: 40,
                background: s.title === "SMS and Text Message Communications" ? "#fff8f3" : "transparent",
                borderRadius: s.title === "SMS and Text Message Communications" ? "0 8px 8px 0" : 0,
                padding: s.title === "SMS and Text Message Communications" ? "16px 20px" : "0 0 0 20px",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#0d2b2b",
                  margin: "0 0 12px 0",
                }}
              >
                {`${i + 1}. ${s.title}`}
              </h2>

              {s.body && (
                <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: "0 0 12px 0" }}>{s.body}</p>
              )}

              {s.bullets && (
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px 0" }}>
                  {s.bullets.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        position: "relative",
                        paddingLeft: 20,
                        marginBottom: 8,
                        fontSize: 15,
                        color: "#374151",
                        lineHeight: 1.8,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 10,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#2abfbf",
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {s.after && (
                <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
                  {s.after}
                </p>
              )}

              {s.contact && (
                <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginTop: 8 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: "#0d2b2b" }}>Custom Insurance Agency</p>
                  <p style={{ margin: 0 }}>1333 Burr Ridge Pkwy STE 200</p>
                  <p style={{ margin: 0 }}>Burr Ridge, IL 60527</p>
                  <p style={{ margin: 0 }}>Phone: 708-810-1955</p>
                  <p style={{ margin: 0 }}>Email: office@custominsure.com</p>
                  <p style={{ margin: 0 }}>Website: custominsure.com</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
