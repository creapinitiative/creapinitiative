import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FileText, Download, Newspaper } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Media — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs, research reports, toolkits and news coverage from CREAP Africa Initiative." },
    ],
  }),
  component: Resources,
});

const NEWS = [
  { tag: "Press", date: "March 2026", title: "CREAP convenes Northern Nigeria youth climate forum" },
  { tag: "Media", date: "February 2026", title: "Oral Health campaign reaches 4,000 learners in FCT schools" },
  { tag: "Press", date: "January 2026", title: "Policy roundtable on civic education with stakeholders" },
];

const PUBS = [
  { tag: "Policy Brief", title: "Promoting Peace and Security in the Face of Emerging Global Threats", body: "Examining peacebuilding strategies in the context of evolving global security challenges." },
  { tag: "Policy Brief", title: "Balancing Innovation and Caution in the Quest for Food Security", body: "Evidence-based pathways to agricultural innovation that maintain ecological integrity." },
  { tag: "Report", title: "Climate-Smart Agriculture & AI for Sustainable Food Systems in Nigeria", body: "Documents implementation of climate-smart agriculture leveraging AI tools." },
  { tag: "Report", title: "Civic Education Baseline Study — North Central Nigeria", body: "A baseline survey of civic awareness, participation and trust among youth across four states." },
];

function Resources() {
  return (
    <>
      <PageHero
        eyebrow="Resources & Media"
        title={<>Evidence, <em className="italic text-goldf">stories</em>, and tools</>}
        body="Publications, reports and media coverage documenting our work and the communities we serve."
      />

      <section className="py-20 lg:py-24 bg-bg">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <div className="mb-12">
            <p className="eyebrow-dark mb-4">News Coverage</p>
            <h2 className="display-lg">In the <em className="text-gold italic">News</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {NEWS.map((n) => (
              <article key={n.title} className="bg-white border border-rule rounded-sm p-7 hover:border-gold transition">
                <Newspaper size={26} strokeWidth={1.5} className="text-gold mb-5" />
                <div className="flex items-center gap-3 mb-3 text-[11px] tracking-[0.16em] uppercase text-ink4">
                  <span className="bg-goldb text-g700 font-semibold px-2 py-1 rounded-sm">{n.tag}</span>
                  <span>{n.date}</span>
                </div>
                <h3 className="font-display text-xl leading-tight">{n.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-g50 border-t border-rule">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <div className="mb-12">
            <p className="eyebrow-dark mb-4">Knowledge Products</p>
            <h2 className="display-lg">Policy Briefs & <em className="text-gold italic">Reports</em></h2>
          </div>
          <div className="space-y-4">
            {PUBS.map((p) => (
              <article key={p.title} className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition">
                <div className="w-16 h-16 grid place-items-center bg-g100 text-g500 group-hover:bg-g600 group-hover:text-white rounded-sm shrink-0 transition">
                  <FileText size={26} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <span className="inline-block bg-goldb text-g700 text-[10px] tracking-[0.16em] uppercase font-semibold px-2 py-1 rounded-sm mb-3">{p.tag}</span>
                  <h3 className="font-display text-xl mb-1.5">{p.title}</h3>
                  <p className="text-sm text-ink3">{p.body}</p>
                </div>
                <a href="#" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g600 transition shrink-0">
                  Download <Download size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
