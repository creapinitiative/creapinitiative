import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listSubmissions } from "@/api/submissions";
import { OpportunityApplications } from "@/components/dashboard/OpportunityApplications";
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
          title="Opportunities"
          description="Roles, fellowships, internships and volunteer calls on the public Opportunities page."
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
