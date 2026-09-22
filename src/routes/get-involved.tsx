import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { useFormSubmit } from "@/lib/use-form-submit";
import { HandHeart, Briefcase, Megaphone, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Volunteer, Partner, Engage | CREAP" },
      { name: "description", content: "Volunteer, partner with us, or join CREAP's events. Apply to become a state coordinator and help drive community change." },
    ],
  }),
  component: GetInvolved,
});

const WAYS = [
  { icon: HandHeart, title: "Volunteer", body: "Join community outreaches, school programs, and field research as a trained CREAP volunteer." },
  { icon: Briefcase, title: "Partner", body: "Public and private institutions: build synergies that amplify community impact through joint initiatives." },
  { icon: Megaphone, title: "Advocate", body: "Use your platform to raise awareness on civic education, climate action and inclusive development." },
];

const EVENTS = [
  { date: "Apr 18, 2026", tag: "Workshop", title: "Civic Education Bootcamp · Abuja" },
  { date: "May 06, 2026", tag: "Outreach", title: "Oral Health Schools Day · Kaduna" },
  { date: "Jun 12, 2026", tag: "Dialogue", title: "Youth & Climate Town Hall · Online" },
];

function GetInvolved() {
  const { status, error, handleSubmit } = useFormSubmit();

  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title={<>Be part of the <em className="italic text-goldf">change</em> you want to see</>}
        body="From frontline volunteering to strategic partnerships, there are many ways to walk this journey with us."
      />

      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="grid md:grid-cols-3 gap-7">
            {WAYS.map(({ icon: Icon, title, body }, idx) => (
              <RevealItem key={title} as="div" index={idx} className="bg-white border border-rule rounded-sm p-9 hover:border-gold hover:shadow-md transition">
                <div className="w-14 h-14 grid place-items-center bg-g100 text-g500 rounded-sm mb-6">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl mb-3">{title}</h3>
                <p className="text-sm text-ink3 leading-relaxed">{body}</p>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-20 bg-g50 border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Upcoming Events</p>
          <h2 className="display-lg mb-12">Mark your <em className="text-gold italic">calendar</em></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {EVENTS.map((e, idx) => (
              <RevealItem key={e.title} as="article" index={idx} className="bg-white border border-rule rounded-sm p-7 hover:border-gold transition">
                <Calendar size={24} strokeWidth={1.5} className="text-gold mb-4" />
                <p className="text-[11px] tracking-[0.16em] uppercase text-ink4 mb-2">{e.date} · {e.tag}</p>
                <h3 className="font-display text-xl leading-tight">{e.title}</h3>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Coordinator form */}
      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[900px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="text-center mb-12">
            <p className="eyebrow-dark mb-4">State Coordinator Application</p>
            <h2 className="display-lg">Lead CREAP in <em className="text-gold italic">your state</em></h2>
          </div>
          <form
            onSubmit={(e) =>
              handleSubmit(e, (fd) => ({
                formType: "coordinator",
                fullName: fd.get("fullName"),
                email: fd.get("email"),
                phone: fd.get("phone"),
                state: fd.get("state"),
                reason: fd.get("reason"),
              }))
            }
            className="bg-white border border-rule rounded-sm p-8 lg:p-10 grid sm:grid-cols-2 gap-5"
          >
            {[
              ["Full name", "fullName", "text"],
              ["Email", "email", "email"],
              ["Phone", "phone", "tel"],
              ["State of residence", "state", "text"],
            ].map(([label, name, type]) => (
              <label key={name} className="flex flex-col gap-2 text-sm">
                <span className="text-ink3 font-medium">{label} *</span>
                <input name={name} type={type} required className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
              </label>
            ))}
            <label className="sm:col-span-2 flex flex-col gap-2 text-sm">
              <span className="text-ink3 font-medium">Why do you want to coordinate CREAP in your state? *</span>
              <textarea name="reason" required rows={5} className="border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition" />
            </label>
            <button
              disabled={status === "submitting"}
              className="sm:col-span-2 bg-g600 hover:bg-g700 disabled:opacity-60 text-white uppercase tracking-wider text-xs font-semibold py-4 rounded-sm transition"
            >
              {status === "submitting" ? "Submitting…" : "Submit Application"}
            </button>
            {status === "success" && (
              <p className="sm:col-span-2 flex items-center gap-2 text-g600 text-sm">
                <CheckCircle2 size={16} /> Thanks — we'll be in touch.
              </p>
            )}
            {status === "error" && (
              <p className="sm:col-span-2 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} /> {error}
              </p>
            )}
          </form>
        </Reveal>
      </section>

      <section className="bg-g700 text-white py-16 text-center">
        <Reveal as="div" className="mx-auto max-w-[800px] px-6">
          <h3 className="display-md text-white mb-5">Prefer to give?</h3>
          <Link to="/donate" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-7 py-3.5 rounded-sm transition">Donate Now</Link>
        </Reveal>
      </section>
    </>
  );
}
