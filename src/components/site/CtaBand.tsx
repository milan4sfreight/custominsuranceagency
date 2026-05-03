import { Button } from "@/components/ui/button";

export const CtaBand = () => {
  return (
    <section className="relative overflow-hidden bg-brand-gradient py-16 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Not sure what coverage you need?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
          Call us or send a message — our agents will find the right policy at the right price. No pressure, no jargon.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-white px-7 text-base font-semibold text-brand hover:bg-white/90"
          >
            <a href="tel:7088101955">📞 Call 708-810-1955</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-white bg-transparent px-7 text-base font-semibold text-white hover:bg-white hover:text-brand"
          >
            <a href="#contact">Send a Message</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaBand;