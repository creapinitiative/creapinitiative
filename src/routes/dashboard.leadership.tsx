import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { leadershipFields } from "@/lib/dashboard-fields";
import { leadershipApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/leadership")({
  loader: () => leadershipApi.list(),
  component: LeadershipAdminPage,
});

function LeadershipAdminPage() {
  const rows = Route.useLoaderData();

  return (
    <CollectionManager
      title="Leadership"
      description="The team roster shown on the public Leadership page."
      fields={leadershipFields}
      collectionKey="leadership"
      rows={rows}
      api={leadershipApi}
      getRowLabel={(row) => row.name as string}
      getRowMeta={(row) => `${row.role} · ${row.team}`}
    />
  );
}
