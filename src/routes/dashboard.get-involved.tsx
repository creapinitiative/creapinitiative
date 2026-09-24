import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listSubmissions } from "@/api/submissions";
import { OpportunityApplications } from "@/components/dashboard/OpportunityApplications";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { OPPORTUNITY_CATEGORY } from "@/lib/opportunity-categories";
import { opportunityFields } from "@/lib/dashboard-fields";
import { opportunitiesApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/get-involved")({
  loader: () => opportunitiesApi.list(),
  component: GetInvolvedAdminPage,
});


function GetInvolvedAdminPage() {
  const rows = Route.useLoaderData() ?? [];
  const [tab, setTab] = useState<"openings" | "applications">("openings");
  const [applicationCount, setApplicationCount] = useState<number | null>(null);

  function loadCount() {
    listSubmissions()
      .then((all) => setApplicationCount((all as { form_type: string }[]).filter((r) => r.form_type === "opportunity").length))
      .catch(() => setApplicationCount(null));
  }
  useEffect(loadCount, []);

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-rule">
        {(
          [
            ["openings", "Openings"],
            ["applications", `Applications${applicationCount === null ? "" : ` (${applicationCount})`}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "px-4 py-2.5 text-sm font-semibold uppercase tracking-wide border-b-2 -mb-px transition",
              tab === key ? "border-g600 text-g700" : "border-transparent text-ink3 hover:text-ink",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "openings" ? (
        <CollectionManager
          title="Get Involved"
          description="Roles, fellowships, internships, volunteer and State Coordinator calls listed on the public Get Involved page."
          fields={opportunityFields}
          collectionKey="opportunities"
          rows={rows}
          api={opportunitiesApi}
          getRowLabel={(row) => row.title as string}
          getRowMeta={(row) => `${row.location} · Apply by ${row.deadline}`}
          getRowBadge={(row) => OPPORTUNITY_CATEGORY[row.category as keyof typeof OPPORTUNITY_CATEGORY]?.label ?? (row.category as string)}
          tabs={Object.entries(OPPORTUNITY_CATEGORY).map(([key, v]) => ({ key, label: v.label }))}
          getRowGroup={(row) => row.category as string}
        />
      ) : (
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">Applications</h1>
          <p className="text-ink3 mb-6 text-sm sm:text-base">
            Everyone who has applied, across all opportunities. Open an entry to see the details, or edit or delete it.
          </p>
          <OpportunityApplications
            opportunities={rows.map((r) => ({ id: r.id as string, title: r.title as string }))}
            onChanged={loadCount}
          />
        </div>
      )}
    </div>
  );
}
