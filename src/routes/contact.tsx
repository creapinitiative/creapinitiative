import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CREAP Africa Initiative" },
      { name: "description", content: "Reach the CREAP team — partnerships, media, programs and general inquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let's <em className="italic text-goldf">build</em> something together</>}
        body="Partnerships, media inquiries, program questions, or volunteering — we'd love to hear from you."
      />

      <section className="py-24 bg-bg">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {[
              { Icon: Mail, label: "Email", value: "info@creapinitiative.org" },
              { Icon: Phone, label: "Phone", value: "+234 (0) 800 000 0000" },
              { Icon: MapPin, label: "Office", value: "Abuja, Nigeria" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-12 h-12 grid place-items-center bg-g100 text-gold rounded-sm shrink-0">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.16em] uppercase text-ink4 font-semibold mb-1">{label}</p>
                  <p className="text-ink2 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you, we'll respond soon."); }} className="lg:col-span-3 bg-white border border-rule rounded-sm p-8 lg:p-10 grid sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-ink3 font-medium">Full name *</span>
              <input required className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-ink3 font-medium">Email *</span>
              <input required type="email" className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-2 text-sm">
              <span className="text-ink3 font-medium">Subject</span>
              <input className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-2 text-sm">
              <span className="text-ink3 font-medium">Message *</span>
              <textarea required rows={6} className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
            </label>
            <button className="sm:col-span-2 bg-g600 hover:bg-g700 text-white uppercase tracking-wider text-xs font-semibold py-4 rounded-sm transition">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
