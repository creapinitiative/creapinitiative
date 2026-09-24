import type { ReactNode } from "react";
import { Download, BookOpen } from "lucide-react";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import type { Report } from "@/api/collections";

/** Card grid shared by the Annual / Financial / Project report pages: cover, summary, download. */
export function ReportList({ reports, label, emptyText }: { reports: Report[]; label: string; emptyText: ReactNode }) {
  return (
    <section className="bg-g50 py-16 lg:py-24">
      <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
        {reports.length === 0 && <p className="text-ink3 text-center py-16">{emptyText}</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <RevealItem
              key={report.id}
              as="article"
              index={idx}
              className="group flex flex-col bg-white border border-rule rounded-sm overflow-hidden hover:border-gold transition"
            >
              <div className="aspect-[4/3] bg-g100 overflow-hidden">
                {report.image_url ? (
                  <img src={report.image_url} alt={report.title} loading="lazy" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-g300">
                    <BookOpen size={64} strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col p-6">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">{label} · {report.date}</p>
                <h2 className="font-display text-2xl leading-tight mb-1">{report.title}</h2>
                {report.subtitle && <p className="text-gold italic font-display text-lg mb-2">{report.subtitle}</p>}
                <p className="text-ink3 leading-relaxed mb-5">{report.body}</p>
                {report.file_url && (
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto self-start inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
                  >
                    Download <Download size={13} />
                  </a>
                )}
              </div>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
