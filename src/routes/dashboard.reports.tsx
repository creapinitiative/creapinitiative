import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { reportFields } from "@/lib/dashboard-fields";
import { reportsApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/reports")({
  loader: () => reportsApi.list(),
  component: ReportsAdminPage,
});

function ReportsAdminPage() {
  const rows = Route.useLoaderData();

  return (
    <CollectionManager
      title="Reports"
      description="Project, Annual and Financial reports — shown under the site's Reports section by category."
      fields={reportFields}
      collectionKey="reports"
      rows={rows}
      api={reportsApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => `${row.category} · ${row.date}`}
    />
  );
}
