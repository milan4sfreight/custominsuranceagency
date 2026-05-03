const features = [
  {
    title: "We Shop For You",
    body:
      "As an independent agency we access 50+ regional and national carriers to find you the best rate.",
  },
  {
    title: "Friendly Local Service",
    body:
      "Our dedicated staff is known for friendly service — the same treatment you'd get from your neighborhood agent.",
  },
  {
    title: "Affordable Coverage",
    body:
      "We shop the market for the lowest price and review your current policy to make sure you're saving as much as possible.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#f5821f]">
          Why us
        </p>
        <h2
          className="mx-auto mt-3 max-w-3xl text-center font-bold tracking-tight text-[#0b1530]"
          style={{ fontSize: "clamp(24px, 5vw, 48px)" }}
        >
          Your neighborhood agency with national reach.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f8f9fa] p-8 transition-all hover:-translate-y-1 hover:border-[#1a6dd4]/30 hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(26,109,212,0.15)]"
            >
              <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#1a6dd4] transition-transform duration-300 group-hover:scale-x-100" />
              <h3 className="text-xl font-semibold text-[#0b1530]">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;