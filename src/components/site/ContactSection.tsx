import { useState } from "react";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
    <section id="contact" className="bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5821f]">Contact</p>
          <h2
            className="mt-3 font-bold tracking-tight text-[#0b1530]"
            style={{ fontSize: "clamp(24px, 5vw, 48px)" }}
          >
            Get in touch
          </h2>
          <p className="mt-3 text-slate-600">
            We're here to help with any insurance questions. Stop by, call, or send us a quick message.
          </p>
          <ul className="mt-8 space-y-5 text-[#0b1530]">
            <ContactRow icon={<MapPin className="h-4 w-4" />} >
              882 62nd St, La Grange Highlands, IL 60525
            </ContactRow>
            <ContactRow icon={<Phone className="h-4 w-4" />}>
              <a href="tel:7088101955" className="font-semibold hover:text-[#1a6dd4]">708-810-1955</a>
              <span className="text-slate-500"> · Fax: 708-810-1970</span>
            </ContactRow>
            <ContactRow icon={<Mail className="h-4 w-4" />}>
              <a href="mailto:info@custominsure.com" className="hover:text-[#1a6dd4]">info@custominsure.com</a>
            </ContactRow>
            <ContactRow icon={<Clock className="h-4 w-4" />}>
              Monday–Friday · 9:00 AM – 5:00 PM
            </ContactRow>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#e2e8f0] bg-[#f8f9fa] p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="firstName">First Name</label>
              <Input id="firstName" name="firstName" required maxLength={60} className="mt-1 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="lastName">Last Name</label>
              <Input id="lastName" name="lastName" required maxLength={60} className="mt-1 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="email">Email</label>
              <Input id="email" name="email" type="email" required maxLength={255} className="mt-1 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="phone">Phone</label>
              <Input id="phone" name="phone" type="tel" required maxLength={30} className="mt-1 h-12" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="type">Insurance Type</label>
              <select
                id="type"
                name="type"
                required
                defaultValue=""
                className="mt-1 flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select a type…</option>
                {insuranceTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#0b1530]" htmlFor="comments">Comments</label>
              <Textarea id="comments" name="comments" maxLength={1000} rows={4} className="mt-1" />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="mt-6 h-12 w-full rounded-full bg-[#1a6dd4] text-base font-semibold text-white hover:bg-[#1559b0] sm:w-auto sm:px-8"
          >
            {submitting ? "Sending…" : "Submit"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;

const ContactRow = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#f0f6ff] text-[#1a6dd4]">
      {icon}
    </span>
    <span className="leading-7">{children}</span>
  </li>
);