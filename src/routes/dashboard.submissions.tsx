import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Archive } from "lucide-react";
import { listSubmissions, updateSubmissionStatus, deleteSubmission } from "@/api/submissions";

export const Route = createFileRoute("/dashboard/submissions")({
  component: SubmissionsPage,
});

type Submission = {
  id: string;
  form_type: "contact" | "coordinator" | "donate_interest" | "newsletter";
  data: Record<string, unknown>;
  status: "new" | "read" | "archived";
  created_at: string;
};

const FORM_LABELS: Record<string, string> = {
  contact: "Contact",
  coordinator: "Coordinator Application",
  donate_interest: "Donation Interest",
  newsletter: "Newsletter",
};

function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function reload() {
    listSubmissions()
      .then((rows) => setSubmissions(rows as Submission[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load submissions."));
  }

  useEffect(reload, []);

  async function markStatus(id: string, status: Submission["status"]) {
    await updateSubmissionStatus({ data: { id, status } });
    reload();
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this submission? This can't be undone.")) return;
    await deleteSubmission({ data: { id } });
    reload();
  }

  const filtered = (submissions ?? []).filter((s) => filter === "all" || s.form_type === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-1">Submissions</h1>
      <p className="text-ink3 mb-6">Every contact, coordinator, donation-interest and newsletter form submitted on the site.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "contact", "coordinator", "donate_interest", "newsletter"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={[
              "px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wide border transition",
              filter === type ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
            ].join(" ")}
          >
            {type === "all" ? "All" : FORM_LABELS[type]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {submissions === null && !error && <p className="text-ink3 text-center py-12">Loading…</p>}
        {submissions !== null && filtered.length === 0 && (
          <p className="text-ink3 text-center py-12">No submissions here yet.</p>
        )}
        {filtered.map((s) => (
          <div key={s.id} className="px-4 sm:px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                className="min-w-0 flex-1 basis-40 text-left"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  {s.status === "new" && <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-g600">{FORM_LABELS[s.form_type]}</p>
                </div>
                <p className="text-ink truncate">
                  {(s.data.name as string) || (s.data.fullName as string) || (s.data.firstName as string) || (s.data.email as string) || "—"}
                </p>
              </button>
              <div className="flex items-center gap-3 shrink-0 ml-auto">
                <p className="text-xs text-ink4 shrink-0 hidden sm:block">{new Date(s.created_at).toLocaleString()}</p>
                <div className="flex gap-1.5 shrink-0">
                  {s.status !== "read" && (
                    <button onClick={() => markStatus(s.id, "read")} className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2" aria-label="Mark read" title="Mark read">
                      <MailOpen size={14} />
                    </button>
                  )}
                  {s.status !== "new" && (
                    <button onClick={() => markStatus(s.id, "new")} className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2" aria-label="Mark unread" title="Mark unread">
                      <Mail size={14} />
                    </button>
                  )}
                  {s.status !== "archived" && (
                    <button onClick={() => markStatus(s.id, "archived")} className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2" aria-label="Archive" title="Archive">
                      <Archive size={14} />
                    </button>
                  )}
                  <button onClick={() => remove(s.id)} className="p-2 border border-rule hover:border-red-400 hover:text-red-600 rounded-sm text-ink2" aria-label="Delete" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-ink4 shrink-0 sm:hidden w-full">{new Date(s.created_at).toLocaleString()}</p>
            </div>

            {expandedId === s.id && (
              <div className="mt-3 bg-g50 rounded-sm p-4 text-sm space-y-1.5">
                {Object.entries(s.data).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-ink4 shrink-0 w-28">{key}</span>
                    <span className="text-ink2">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
