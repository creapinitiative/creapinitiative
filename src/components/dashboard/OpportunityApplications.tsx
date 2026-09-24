import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, X, ExternalLink, Mail, Phone } from "lucide-react";
import { listSubmissions, deleteSubmission, updateOpportunityApplication } from "@/api/submissions";

export type Application = {
  id: string;
  form_type: string;
  status: "new" | "read" | "archived";
  created_at: string;
  data: {
    opportunityId?: string;
    opportunityTitle?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    cvLink?: string;
    message?: string;
  };
};

const STATUS_LABEL: Record<Application["status"], string> = { new: "New", read: "Reviewed", archived: "Archived" };
const STATUS_STYLE: Record<Application["status"], string> = {
  new: "bg-gold/15 text-g700",
  read: "bg-g100 text-g700",
  archived: "bg-ink4/15 text-ink3",
};

const inputClass = "w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition bg-white";

function EditApplication({
  application,
  onCancel,
  onSaved,
}: {
  application: Application;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const d = application.data;
  const [fullName, setFullName] = useState(d.fullName ?? "");
  const [email, setEmail] = useState(d.email ?? "");
  const [phone, setPhone] = useState(d.phone ?? "");
  const [cvLink, setCvLink] = useState(d.cvLink ?? "");
  const [message, setMessage] = useState(d.message ?? "");
  const [status, setStatus] = useState<Application["status"]>(application.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateOpportunityApplication({ data: { id: application.id, status, data: { fullName, email, phone, cvLink, message } } });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/40" onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl h-full bg-white overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-rule shrink-0">
          <div>
            <h2 className="font-display text-2xl text-ink">Edit application</h2>
            <p className="text-sm text-ink3">{d.opportunityTitle}</p>
          </div>
          <button type="button" onClick={onCancel} className="p-1.5 text-ink3 hover:text-ink" aria-label="Close" title="Close">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 px-6 py-6 space-y-5">
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Full name *</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Email *</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Phone *</span>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">CV link</span>
            <input type="url" value={cvLink} onChange={(e) => setCvLink(e.target.value)} placeholder="https://" className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Message</span>
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as Application["status"])} className={inputClass}>
              {(Object.keys(STATUS_LABEL) as Application["status"][]).map((k) => (
                <option key={k} value={k}>{STATUS_LABEL[k]}</option>
              ))}
            </select>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-rule flex gap-3 shrink-0">
          <button type="button" onClick={onCancel} className="flex-1 border border-rule text-ink2 text-sm font-semibold uppercase tracking-wide py-3 rounded-sm hover:border-g500 transition">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-g600 hover:bg-g700 disabled:opacity-60 text-white text-sm font-semibold uppercase tracking-wide py-3 rounded-sm transition">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Every application, filterable by opportunity, with view / edit / delete. */
export function OpportunityApplications({
  opportunities,
  initialOpportunityId,
  onChanged,
}: {
  opportunities: { id: string; title: string }[];
  initialOpportunityId?: string;
  onChanged?: () => void;
}) {
  const [rows, setRows] = useState<Application[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialOpportunityId ?? "all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Application | null>(null);

  function reload() {
    listSubmissions()
      .then((all) => setRows((all as Application[]).filter((r) => r.form_type === "opportunity")))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load applications."));
  }
  useEffect(reload, []);

  // Openings that were deleted after people applied still need to be reachable.
  const filterOptions = useMemo(() => {
    const known = new Map(opportunities.map((o) => [o.id, o.title]));
    for (const r of rows ?? []) {
      if (r.data.opportunityId && !known.has(r.data.opportunityId)) {
        known.set(r.data.opportunityId, `${r.data.opportunityTitle ?? "Removed opportunity"} (removed)`);
      }
    }
    return [...known.entries()].map(([id, title]) => ({
      id,
      title,
      count: (rows ?? []).filter((r) => r.data.opportunityId === id).length,
    }));
  }, [opportunities, rows]);

  const visible = (rows ?? []).filter((r) => filter === "all" || r.data.opportunityId === filter);

  async function remove(r: Application) {
    if (!window.confirm(`Delete ${r.data.fullName ?? "this"}'s application? This can't be undone.`)) return;
    try {
      await deleteSubmission({ data: { id: r.id } });
      reload();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the application.");
    }
  }

  return (
    <div>
      <label className="flex flex-wrap items-center gap-2 mb-5 text-sm text-ink3">
        Opportunity:
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-rule rounded-sm px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-gold max-w-full"
        >
          <option value="all">All opportunities ({rows?.length ?? "…"})</option>
          {filterOptions.map((o) => (
            <option key={o.id} value={o.id}>{o.title} ({o.count})</option>
          ))}
        </select>
      </label>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {rows === null && !error && <p className="text-ink3 text-center py-12">Loading…</p>}
        {rows !== null && visible.length === 0 && <p className="text-ink3 text-center py-12">No applications here yet.</p>}
        {visible.map((r) => (
          <div key={r.id} className="px-4 sm:px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="min-w-0 flex-1 basis-48 text-left">
                <p className="text-xs text-g600 truncate mb-0.5">{r.data.opportunityTitle}</p>
                <p className="text-ink font-medium truncate">{r.data.fullName ?? "—"}</p>
                <p className="text-sm text-ink3 truncate">{r.data.email}</p>
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <span className={`text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-sm ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
                <p className="text-xs text-ink4 hidden sm:block">{new Date(r.created_at).toLocaleDateString()}</p>
                <button onClick={() => setEditing(r)} className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2 transition" aria-label="Edit" title="Edit">
                  <Pencil size={15} />
                </button>
                <button onClick={() => remove(r)} className="p-2 border border-rule hover:border-red-400 hover:text-red-600 rounded-sm text-ink2 transition" aria-label="Delete" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {expandedId === r.id && (
              <div className="mt-3 bg-g50 rounded-sm p-4 text-sm space-y-2">
                <p className="flex items-center gap-2 text-ink2"><Mail size={14} className="text-ink4" /> {r.data.email}</p>
                <p className="flex items-center gap-2 text-ink2"><Phone size={14} className="text-ink4" /> {r.data.phone}</p>
                {r.data.cvLink && (
                  <a href={r.data.cvLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-g600 underline break-all">
                    <ExternalLink size={14} /> View CV
                  </a>
                )}
                {r.data.message && <p className="text-ink2 whitespace-pre-line pt-1">{r.data.message}</p>}
                <p className="text-xs text-ink4 pt-1">Applied {new Date(r.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <EditApplication
          application={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}
