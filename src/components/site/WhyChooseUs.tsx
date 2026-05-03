const features = [
  {
    icon: "🔍",
    title: "We Shop For You",
    body:
      "As an independent agency we access 50+ regional and national carriers to find you the best rate.",
  },
  {
    icon: "🤝",
    title: "Friendly Local Service",
    body:
      "Our dedicated staff is known for its friendly service. Expect the same treatment you'd get from your neighborhood insurance agent.",
  },
  {
    icon: "💰",
    title: "Affordable Coverage",
    body:
      "We shop the market for the provider with the lowest price. We can review your current policy to find out if you're saving the maximum amount possible.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Your neighborhood agency with national reach.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-8 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="text-4xl" aria-hidden>{f.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-ink">{f.title}</h3>
              <p className="mt-3 text-muted-ink leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;