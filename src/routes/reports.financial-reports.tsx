import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ReportList } from "@/components/site/ReportList";
import { listReportsByCategory } from "@/api/collections-api";
import { Download, Wallet } from "lucide-react";

export const Route = createFileRoute("/reports/financial-reports")({
  head: () => ({
    meta: [
      { title: "Financial Reports — CREAP Africa Initiative" },
      { name: "description", content: "Financial reports and statements of income and expenditure from CREAP Africa Initiative." },
    ],
  }),
  loader: () => listReportsByCategory({ data: { category: "financial" } }),
  component: FinancialReportsPage,
});

function FinancialReportsPage() {
  const reports = Route.useLoaderData() ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Financial Reports"
        title="Financial Reports"
        body="A transparent record of our income and expenditure, year on year."
      />

      <ReportList reports={reports} label="Financial Report" emptyText="No financial reports published yet." />
    </>
  );
}
