import { useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
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
  getRowImage,
  getRowBadge,
  tabs,
  getRowGroup,
}: {
  title: string;
  description?: string;
  fields: FieldConfig[];
  collectionKey: string;
  rows: Row[];
  api: { create: ServerFn; update: ServerFn; remove: ServerFn };
  getRowLabel: (row: Row) => string;
  getRowMeta?: (row: Row) => string;
  /** Optional thumbnail image shown to the left of each row. */
  getRowImage?: (row: Row) => string | undefined;
  /** Optional small tag/pill shown next to the row label. */
  getRowBadge?: (row: Row) => string | undefined;
  /** When provided together with `getRowGroup`, renders a tab bar that filters rows by group. */
  tabs?: { key: string; label: string }[];
  getRowGroup?: (row: Row) => string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs?.[0]?.key ?? "all");

  const visibleRows = useMemo(() => {
    if (!tabs || !getRowGroup || activeTab === "all") return rows;
    return rows.filter((row) => getRowGroup(row) === activeTab);
  }, [rows, tabs, getRowGroup, activeTab]);

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
          <h1 className="font-display text-2xl sm:text-3xl text-ink">{title}</h1>
          {description && <p className="text-ink3 mt-1 text-sm sm:text-base">{description}</p>}
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition shrink-0"
        >
          <Plus size={14} /> New Entry
        </button>
      </div>

      {tabs && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActiveTab("all")}
            className={[
              "px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wide border transition",
              activeTab === "all" ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
            ].join(" ")}
          >
            All
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                "px-3.5 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wide border transition",
                activeTab === tab.key ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {visibleRows.length === 0 && (
          <p className="text-ink3 text-center py-12 px-4">No entries here yet — click "New Entry" to add one.</p>
        )}
        {visibleRows.map((row) => {
          const imageUrl = getRowImage?.(row);
          const badge = getRowBadge?.(row);
          return (
            <div key={row.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 px-4 sm:px-5 py-4">
              {getRowImage && (
                <div className="w-12 h-12 rounded-sm border border-rule bg-g50 shrink-0 overflow-hidden grid place-items-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={16} className="text-ink4" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1 basis-40">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-ink truncate">{getRowLabel(row)}</p>
                  {badge && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm bg-g100 text-g700">
                      {badge}
                    </span>
                  )}
                </div>
                {getRowMeta && <p className="text-sm text-ink3 truncate">{getRowMeta(row)}</p>}
              </div>
              <div className="flex gap-2 shrink-0 ml-auto">
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
          );
        })}
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
