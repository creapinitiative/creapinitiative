import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ReportList } from "@/components/site/ReportList";
import { listReportsByCategory } from "@/api/collections-api";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/reports/project-reports")({
  head: () => ({
    meta: [
      { title: "Project Reports — CREAP Africa Initiative" },
      { name: "description", content: "Reports from CREAP Africa Initiative's programs and campaigns, documenting outcomes and lessons learned." },
    ],
  }),
  loader: () => listReportsByCategory({ data: { category: "project" } }),
  component: ProjectReportsPage,
});

function ProjectReportsPage() {
  const reports = Route.useLoaderData() ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Reports / Project Reports"
        title="Project Reports"
        body="Outcomes, lessons and evidence from CREAP's programs and community campaigns."
      />

      <ReportList reports={reports} label="Project Report" emptyText="No project reports published yet." />
    </>
  );
}
