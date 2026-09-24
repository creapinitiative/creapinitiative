import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { opportunityFields } from "@/lib/dashboard-fields";
import { opportunitiesApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/opportunities")({
  loader: () => opportunitiesApi.list(),
  component: OpportunitiesAdminPage,
});

const CATEGORY_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  fellowship: "Fellowship",
  internship: "Internship",
  volunteer: "Volunteer",
};

function OpportunitiesAdminPage() {
  const rows = Route.useLoaderData() ?? [];

  return (
    <CollectionManager
      title="Opportunities"
      description="Roles, fellowships, internships and volunteer calls on the public Opportunities page. Applications appear under Submissions."
      fields={opportunityFields}
      collectionKey="opportunities"
      rows={rows}
      api={opportunitiesApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => `${row.location} · Apply by ${row.deadline}`}
      getRowBadge={(row) => CATEGORY_LABELS[row.category as string] ?? (row.category as string)}
      tabs={Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }))}
      getRowGroup={(row) => row.category as string}
    />
  );
}
