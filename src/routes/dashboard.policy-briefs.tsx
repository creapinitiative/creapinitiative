import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { policyBriefFields } from "@/lib/dashboard-fields";
import { policyBriefCover } from "@/lib/policy-brief-covers";
import { policyBriefsApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/policy-briefs")({
  loader: () => policyBriefsApi.list(),
  component: PolicyBriefsAdminPage,
});

function PolicyBriefsAdminPage() {
  const rows = Route.useLoaderData() ?? [];

  return (
    <CollectionManager
      title="Policy Briefs"
      description="Research-informed briefs shown on the public Policy Briefs page."
      fields={policyBriefFields}
      collectionKey="policy-briefs"
      rows={rows}
      api={policyBriefsApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => row.date as string}
      getRowImage={(row) => (row.image_url as string | undefined) || policyBriefCover(row.title as string)}
    />
  );
}
