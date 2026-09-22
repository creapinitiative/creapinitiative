import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/resources/policy-briefs")({
  head: () => ({
    meta: [
      { title: "Policy Briefs — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs and research publications from CREAP Africa Initiative." },
    ],
  }),
  component: PolicyBriefsPage,
});

const BRIEFS = [
  {
    title: "Promoting Peace and Security in the Face of Emerging Global Threats",
    body: "Examining peacebuilding strategies in the context of evolving global security challenges.",
    date: "May 2026",
  },
  {
    title: "Balancing Innovation and Caution in the Quest for Food Security",
    body: "Evidence-based pathways to agricultural innovation that maintain ecological integrity.",
    date: "April 2026",
  },
  {
    title: "Climate-Smart Agriculture and AI for Sustainable Food Systems in Nigeria",
    body: "A practical brief on integrating AI responsibly into agricultural adaptation and food system resilience.",
    date: "March 2026",
  },
  {
    title: "Citizen Participation and Inclusive Governance in Local Communities",
    body: "Recommendations for strengthening meaningful public participation in local decision-making processes.",
    date: "February 2026",
  },
  {
    title: "Youth Voices in Climate Policy: Bridging Local Experience and National Action",
    body: "How youth-led adaptation experiences can shape stronger and more responsive policy frameworks.",
    date: "January 2026",
  },
  {
    title: "Civic Trust and Social Cohesion in Fragile Contexts",
    body: "Strategies for rebuilding trust through dialogue, transparency, and inclusive service delivery.",
    date: "December 2025",
  },
];

function PolicyBriefsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Policy Briefs"
        title="Policy Briefs"
        body="Research-informed recommendations to guide better policy and stronger community outcomes."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {BRIEFS.map((brief, idx) => (
            <RevealItem
              key={brief.title}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <FileText size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Policy Brief · {brief.date}</p>
                <h2 className="font-display text-3xl leading-tight mb-2">{brief.title}</h2>
                <p className="text-ink3 leading-relaxed">{brief.body}</p>
              </div>
              <a
                href="#"
                className="shrink-0 inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
              >
                Download <Download size={13} />
              </a>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
