import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/reports/project-reports")({
  head: () => ({
    meta: [
      { title: "Project Reports — CREAP Africa Initiative" },
      { name: "description", content: "Reports from CREAP Africa Initiative's programs and campaigns, documenting outcomes and lessons learned." },
    ],
  }),
  component: ProjectReportsPage,
});

const PROJECT_REPORTS = [
  {
    title: "16-Days of Activism Report",
    subtitle: "End Digital Violence Against Women and Girls",
    body: "A review of CREAP's 2025 16 Days of Activism campaign — radio advocacy, a special webinar, national conference participation, multistakeholder dialogues and field outreach promoting safer physical and digital spaces for women and girls.",
    date: "December 2025",
    file: "/reports/16-days-activism-report-2025.pdf",
  },
  {
    title: "Project Report",
    subtitle: "Youth Skills and Digital Future Initiative",
    body: "Findings from the Youth Skills and Digital Future Initiative in Niger State, equipping young Nigerians with digital skills, innovation and enterprise training.",
    date: "August 2024",
    file: "/reports/youth-skills-and-digital-future-initiative.pdf",
  },
];

function ProjectReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Project Reports"
        title="Project Reports"
        body="Outcomes, lessons and evidence from CREAP's programs and community campaigns."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {PROJECT_REPORTS.map((report, idx) => (
            <RevealItem
              key={report.title}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <FileText size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Project Report · {report.date}</p>
                <h2 className="font-display text-3xl leading-tight mb-1">{report.title}</h2>
                <p className="text-gold italic font-display text-lg mb-2">{report.subtitle}</p>
                <p className="text-ink3 leading-relaxed">{report.body}</p>
              </div>
              <a
                href={report.file}
                download
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
