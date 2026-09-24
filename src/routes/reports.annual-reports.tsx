import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ReportList } from "@/components/site/ReportList";
import { listReportsByCategory } from "@/api/collections-api";

export const Route = createFileRoute("/reports/annual-reports")({
  head: () => ({
    meta: [
      { title: "Annual Reports — CREAP Africa Initiative" },
      { name: "description", content: "CREAP Africa Initiative's annual reports, documenting our programs, impact and growth each year." },
    ],
  }),
  loader: () => listReportsByCategory({ data: { category: "annual" } }),
  component: AnnualReportsPage,
});

function AnnualReportsPage() {
  const reports = Route.useLoaderData() ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Annual Reports"
        title="Annual Reports"
        body="A yearly record of our programs, partnerships and impact across Nigeria and Africa."
      />

      <ReportList reports={reports} label="Annual Report" emptyText="No annual reports published yet." />
    </>
  );
}
