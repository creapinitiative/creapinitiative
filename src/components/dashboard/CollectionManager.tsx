import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FieldConfig } from "@/lib/dashboard-fields";
import { EntryForm } from "@/components/dashboard/EntryForm";

type Row = Record<string, unknown> & { id: string };
type ServerFn = (opts: { data: unknown }) => Promise<unknown>;

export function CollectionManager({
  title,
  description,
  fields,
  collectionKey,
  rows,
  api,
  getRowLabel,
  getRowMeta,
}: {
  title: string;
  description?: string;
  fields: FieldConfig[];
  collectionKey: string;
  rows: Row[];
  api: { create: ServerFn; update: ServerFn; remove: ServerFn };
  getRowLabel: (row: Row) => string;
  getRowMeta?: (row: Row) => string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, unknown>) {
    if (editing === "new") {
      await api.create({ data: values });
    } else if (editing) {
      await api.update({ data: { id: editing.id, data: values } });
    }
    await router.invalidate();
    setEditing(null);
  }

  async function handleDelete(row: Row) {
    if (!window.confirm(`Delete "${getRowLabel(row)}"? This can't be undone.`)) return;
    setDeletingId(row.id);
    try {
      await api.remove({ data: { id: row.id } });
      await router.invalidate();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">{title}</h1>
          {description && <p className="text-ink3 mt-1">{description}</p>}
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition"
        >
          <Plus size={14} /> New Entry
        </button>
      </div>

      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {rows.length === 0 && (
          <p className="text-ink3 text-center py-12">No entries yet — click "New Entry" to add the first one.</p>
        )}
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="font-medium text-ink truncate">{getRowLabel(row)}</p>
              {getRowMeta && <p className="text-sm text-ink3 truncate">{getRowMeta(row)}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setEditing(row)}
                className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2 transition"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(row)}
                disabled={deletingId === row.id}
                className="p-2 border border-rule hover:border-red-400 hover:text-red-600 rounded-sm text-ink2 disabled:opacity-50 transition"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <EntryForm
          fields={fields}
          collectionKey={collectionKey}
          initialValues={editing === "new" ? {} : editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
