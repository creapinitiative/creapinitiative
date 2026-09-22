import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { toolkitGuideFields } from "@/lib/dashboard-fields";
import { toolkitsGuidesApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/toolkits-guides")({
  loader: () => toolkitsGuidesApi.list(),
  component: ToolkitsGuidesAdminPage,
});

function ToolkitsGuidesAdminPage() {
  const rows = Route.useLoaderData() ?? [];

  return (
    <CollectionManager
      title="Toolkits & Guides"
      description="Resources shown on the public Toolkits & Guides page, under Knowledge Hub."
      fields={toolkitGuideFields}
      collectionKey="toolkits-guides"
      rows={rows}
      api={toolkitsGuidesApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => row.date as string}
    />
  );
}
