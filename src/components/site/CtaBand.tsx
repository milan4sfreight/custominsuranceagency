import { Button } from "@/components/ui/button";

export const CtaBand = () => {
  return (
    <section className="bg-transparent py-20">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <h2
          className="font-bold tracking-tight text-[#0d2b2b]"
          style={{ fontSize: "clamp(24px, 5vw, 48px)" }}
        >
          Not sure what coverage you need?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Call us or send a message — our agents will find the right policy at the right price. No pressure, no jargon.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-[#3eaa6d] px-7 text-base font-semibold text-white hover:bg-[#1559b0]"
          >
            <a href="tel:7088101955">Call 708-810-1955</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-[#3eaa6d]/30 bg-white px-7 text-base font-semibold text-[#3eaa6d] hover:bg-[#3eaa6d] hover:text-white"
          >
            <a href="#contact">Send a Message</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;