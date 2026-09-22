import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { upcomingProgramFields } from "@/lib/dashboard-fields";
import { upcomingProgramsApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/programs")({
  loader: () => upcomingProgramsApi.list(),
  component: ProgramsAdminPage,
});

function ProgramsAdminPage() {
  const rows = Route.useLoaderData();

  return (
    <CollectionManager
      title="Upcoming Programs"
      description="Events and workshops shown on the public Upcoming Programs page and homepage."
      fields={upcomingProgramFields}
      collectionKey="programs"
      rows={rows}
      api={upcomingProgramsApi}
      getRowLabel={(row) => row.subtitle as string}
      getRowMeta={(row) => `${row.date} · ${row.venue}`}
    />
  );
}
