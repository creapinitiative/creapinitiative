import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download, BookOpen } from "lucide-react";

export const Route = createFileRoute("/reports/annual-reports")({
  head: () => ({
    meta: [
      { title: "Annual Reports — CREAP Africa Initiative" },
      { name: "description", content: "CREAP Africa Initiative's annual reports, documenting our programs, impact and growth each year." },
    ],
  }),
  component: AnnualReportsPage,
});

const ANNUAL_REPORTS = [
  {
    title: "CREAP 2025 Annual Report",
    subtitle: "The Year of Momentum",
    body: "A look back at a year of expanded programs, new partnerships and deepening community impact across Nigeria.",
    date: "2025",
    file: "/reports/creap-annual-report-2025-the-year-of-momentum.pdf",
  },
  {
    title: "CREAP 2024 Annual Report",
    subtitle: "A Bold Beginning",
    body: "Our founding year in review — the programs, partnerships and communities that shaped CREAP Africa Initiative's first chapter.",
    date: "2024",
    file: "/reports/creap-annual-report-2024-a-bold-beginning.pdf",
  },
];

function AnnualReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Annual Reports"
        title="Annual Reports"
        body="A yearly record of our programs, partnerships and impact across Nigeria and Africa."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {ANNUAL_REPORTS.map((report, idx) => (
            <RevealItem
              key={report.title}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <BookOpen size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Annual Report · {report.date}</p>
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
