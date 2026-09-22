import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { leadershipFields } from "@/lib/dashboard-fields";
import { leadershipApi } from "@/api/collections-api";

const TEAM_LABELS: Record<string, string> = {
  executive: "Executive",
  management: "Management",
  state: "State",
};

export const Route = createFileRoute("/dashboard/leadership")({
  loader: () => leadershipApi.list(),
  component: LeadershipAdminPage,
});

function LeadershipAdminPage() {
  const rows = Route.useLoaderData() ?? [];

  return (
    <CollectionManager
      title="Leadership"
      description="The team roster shown on the public Leadership page."
      fields={leadershipFields}
      collectionKey="leadership"
      rows={rows}
      api={leadershipApi}
      getRowLabel={(row) => row.name as string}
      getRowMeta={(row) => row.role as string}
      getRowImage={(row) => row.photo_url as string | undefined}
      getRowBadge={(row) => TEAM_LABELS[row.team as string] ?? (row.team as string)}
      tabs={[
        { key: "executive", label: "Executive" },
        { key: "management", label: "Management" },
        { key: "state", label: "State" },
      ]}
      getRowGroup={(row) => row.team as string}
    />
  );
}
