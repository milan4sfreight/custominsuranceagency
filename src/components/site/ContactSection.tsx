import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const insuranceTypes = [
  "Auto",
  "Homeowners",
  "Renters",
  "Trucking",
  "Business & Commercial",
  "Life & Health",
  "Flood",
  "Motorcycle",
  "Watercraft & Boat",
  "Limousine",
  "Recreational Vehicle",
];

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  type: z.string().min(1, "Select an insurance type"),
  comments: z.string().trim().max(1000).optional(),
});

export const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      type: String(fd.get("type") ?? ""),
      comments: String(fd.get("comments") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks! We'll be in touch shortly.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <section id="contact" className="bg-secondary py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Get in touch</h2>
          <p className="mt-3 text-muted-ink">
            We're here to help with any insurance questions. Stop by, call, or send us a quick message.
          </p>
          <ul className="mt-8 space-y-4 text-ink">
            <li className="flex items-start gap-3">
              <span className="text-xl" aria-hidden>📍</span>
              <span>882 62nd St, La Grange Highlands, IL 60525</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl" aria-hidden>📞</span>
              <span>
                <a href="tel:7088101955" className="font-semibold hover:text-brand">708-810-1955</a>
                <span className="text-muted-ink"> · Fax: 708-810-1970</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl" aria-hidden>✉</span>
              <a href="mailto:info@custominsure.com" className="hover:text-brand">info@custominsure.com</a>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl" aria-hidden>🕐</span>
              <span>Monday–Friday · 9:00 AM – 5:00 PM</span>
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="firstName">First Name</label>
              <Input id="firstName" name="firstName" required maxLength={60} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="lastName">Last Name</label>
              <Input id="lastName" name="lastName" required maxLength={60} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" required maxLength={255} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink" htmlFor="phone">Phone</label>
              <Input id="phone" name="phone" type="tel" required maxLength={30} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink" htmlFor="type">Insurance Type</label>
              <select
                id="type"
                name="type"
                required
                defaultValue=""
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select a type…</option>
                {insuranceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink" htmlFor="comments">Comments</label>
              <Textarea id="comments" name="comments" maxLength={1000} rows={4} className="mt-1" />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="mt-6 h-12 w-full rounded-full bg-brand text-base font-semibold text-brand-foreground hover:bg-brand/90 sm:w-auto sm:px-8"
          >
            {submitting ? "Sending…" : "Submit"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;