import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { OpportunityApplyDialog } from "@/components/site/OpportunityApplyDialog";
import { OPPORTUNITY_CATEGORY } from "@/lib/opportunity-categories";
import { opportunitiesApi } from "@/api/collections-api";
import type { Opportunity } from "@/api/collections";
import { HandHeart, Briefcase, Megaphone, Calendar } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/get-involved")({
  head: () => ({
    meta: [
      { title: "Get Involved — Volunteer, Partner, Engage | CREAP" },
      { name: "description", content: "Volunteer, partner with us, apply for open roles, fellowships and internships, or become a CREAP State Coordinator." },
    ],
  }),
  // Show the empty state rather than an error page if the table isn't there yet.
  loader: () => opportunitiesApi.list().catch(() => [] as Opportunity[]),
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
  const openings = Route.useLoaderData() ?? [];
  const [filter, setFilter] = useState<"all" | Opportunity["category"]>("all");
  const [applying, setApplying] = useState<Opportunity | null>(null);

  const categories = (Object.keys(OPPORTUNITY_CATEGORY) as Opportunity["category"][]).filter((c) =>
    openings.some((o) => o.category === c),
  );
  const shown = openings.filter((o) => filter === "all" || o.category === filter);

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

      {/* Open opportunities — managed from Dashboard → Get Involved */}
      <section id="opportunities" className="py-24 bg-bg scroll-mt-28">
        <Reveal as="div" className="mx-auto max-w-[1100px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="text-center mb-10">
            <p className="eyebrow-dark mb-4">Open Opportunities</p>
            <h2 className="display-lg mb-4">Build your career on <em className="text-gold italic">purpose</em></h2>
            <p className="text-ink3 max-w-xl mx-auto">
              Roles, fellowships, internships, volunteer calls and State Coordinator positions — apply to the one that fits you.
            </p>
          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {(["all", ...categories] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={[
                    "px-4 py-2 rounded-sm text-[12px] font-semibold uppercase tracking-[0.1em] border transition",
                    filter === c ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500 hover:text-ink",
                  ].join(" ")}
                >
                  {c === "all" ? "All" : OPPORTUNITY_CATEGORY[c].label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {openings.length === 0 && (
              <p className="text-ink3 text-center py-12">No open opportunities right now — please check back soon.</p>
            )}
            {shown.map((job, idx) => {
              const { label, icon: Icon } = OPPORTUNITY_CATEGORY[job.category] ?? OPPORTUNITY_CATEGORY["full-time"];
              return (
                <RevealItem key={job.id} as="article" index={idx} className="bg-white border border-rule rounded-sm p-7 lg:p-8 grid md:grid-cols-12 gap-6 items-center hover:border-gold transition">
                  <div className="md:col-span-1"><Icon size={28} strokeWidth={1.5} className="text-gold" /></div>
                  <div className="md:col-span-7">
                    <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-gold">{label}</span>
                    <h3 className="font-display text-2xl mt-1">{job.title}</h3>
                    <p className="text-sm text-ink3 mt-1">{job.location} · Apply by {job.deadline}</p>
                    {job.description && <p className="text-ink3 mt-2 leading-relaxed">{job.description}</p>}
                  </div>
                  <div className="md:col-span-4 md:text-right">
                    <button
                      onClick={() => setApplying(job)}
                      className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white uppercase tracking-wider text-xs font-semibold px-6 py-3 rounded-sm transition"
                    >
                      Apply
                    </button>
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </Reveal>
      </section>

      {applying && <OpportunityApplyDialog opportunity={applying} onClose={() => setApplying(null)} />}

      <section className="bg-g700 text-white py-16 text-center">
        <Reveal as="div" className="mx-auto max-w-[800px] px-6">
          <h3 className="display-md text-white mb-5">Prefer to give?</h3>
          <Link to="/donate" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-7 py-3.5 rounded-sm transition">Donate Now</Link>
        </Reveal>
      </section>
    </>
  );
}
