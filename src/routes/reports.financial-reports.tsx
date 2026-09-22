import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download, Wallet } from "lucide-react";

export const Route = createFileRoute("/reports/financial-reports")({
  head: () => ({
    meta: [
      { title: "Financial Reports — CREAP Africa Initiative" },
      { name: "description", content: "Financial reports and statements of income and expenditure from CREAP Africa Initiative." },
    ],
  }),
  component: FinancialReportsPage,
});

const FINANCIAL_REPORTS = [
  {
    title: "Financial Report",
    subtitle: "FY2025",
    body: "Summary of income and expenditure for the 2025 financial year.",
    date: "2025",
    file: "/reports/creap-financial-report-fy2025.pdf",
  },
  {
    title: "Financial Report",
    subtitle: "FY2024",
    body: "Summary of income and expenditure for the 2024 financial year.",
    date: "2024",
    file: "/reports/creap-financial-report-fy2024.pdf",
  },
];

function FinancialReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Financial Reports"
        title="Financial Reports"
        body="A transparent record of our income and expenditure, year on year."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {FINANCIAL_REPORTS.map((report, idx) => (
            <RevealItem
              key={report.subtitle}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <Wallet size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Financial Report · {report.date}</p>
                <h2 className="font-display text-3xl leading-tight mb-1">{report.title} — {report.subtitle}</h2>
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
