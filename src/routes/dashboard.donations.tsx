import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { listDonations } from "@/api/paystack";

export const Route = createFileRoute("/dashboard/donations")({
  component: DonationsPage,
});

type Donation = Awaited<ReturnType<typeof listDonations>>[number];

const FILTERS = ["success", "pending", "failed", "all"] as const;
const STATUS_LABEL: Record<Donation["status"], string> = { success: "Successful", pending: "Pending", failed: "Failed" };
const STATUS_STYLE: Record<Donation["status"], string> = {
  success: "bg-g100 text-g700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-600",
};

const naira = (kobo: number) => `₦${(Number(kobo) / 100).toLocaleString("en-NG")}`;

function DonationsPage() {
  const [donations, setDonations] = useState<Donation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("success");

  useEffect(() => {
    listDonations()
      .then(setDonations)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load donations."));
  }, []);

  const paid = (donations ?? []).filter((d) => d.status === "success");
  const total = paid.reduce((sum, d) => sum + Number(d.amount_kobo), 0);
  const givers = new Set(paid.map((d) => d.email.toLowerCase())).size;
  const rows = (donations ?? []).filter((d) => filter === "all" || d.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink mb-1">Donations</h1>
          <p className="text-ink3">Gifts made through Paystack on the Give Online form.</p>
        </div>
        <Link
          to="/dashboard/messaging"
          className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition"
        >
          <Send size={13} /> Message givers
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Total raised", donations ? naira(total) : "—"],
          ["Successful gifts", donations ? String(paid.length) : "—"],
          ["Unique givers", donations ? String(givers) : "—"],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-rule rounded-sm p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink4 mb-1.5">{label}</p>
            <p className="font-display text-3xl text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wide border transition",
              filter === f ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
            ].join(" ")}
          >
            {f === "all" ? "All" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {donations === null && !error && <p className="text-ink3 text-center py-12">Loading…</p>}
        {donations !== null && rows.length === 0 && <p className="text-ink3 text-center py-12">No donations here yet.</p>}
        {rows.map((d) => (
          <div key={d.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 sm:px-5 py-4">
            <div className="min-w-0 flex-1 basis-48">
              <p className="text-ink truncate">{d.full_name}</p>
              <p className="text-sm text-ink3 truncate">{d.email}</p>
            </div>
            <div className="text-xs text-ink4 basis-40">
              <p>{new Date(d.paid_at ?? d.created_at).toLocaleString()}</p>
              <p className="truncate">{d.channel ? `${d.channel} · ` : ""}{d.reference}</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <span className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm ${STATUS_STYLE[d.status]}`}>
                {STATUS_LABEL[d.status]}
              </span>
              <p className="font-display text-xl text-ink w-28 text-right">{naira(d.amount_kobo)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
