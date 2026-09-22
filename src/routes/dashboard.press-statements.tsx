import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { pressStatementFields } from "@/lib/dashboard-fields";
import { pressStatementsApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/press-statements")({
  loader: () => pressStatementsApi.list(),
  component: PressStatementsAdminPage,
});

function PressStatementsAdminPage() {
  const rows = Route.useLoaderData() ?? [];

  return (
    <CollectionManager
      title="Press Statements"
      description="Statements shown on the public Press Statements page, under Knowledge Hub."
      fields={pressStatementFields}
      collectionKey="press-statements"
      rows={rows}
      api={pressStatementsApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => row.date as string}
    />
  );
}
