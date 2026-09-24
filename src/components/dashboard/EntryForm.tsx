import { useState } from "react";
import { Upload, X } from "lucide-react";
import type { FieldConfig } from "@/lib/dashboard-fields";
import { uploadImageToGitHub } from "@/api/github-upload";

type Values = Record<string, unknown>;

function toTextareaList(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}

function fromTextareaList(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function EntryForm({
  fields,
  initialValues,
  collectionKey,
  onCancel,
  onSubmit,
}: {
  fields: FieldConfig[];
  initialValues: Values;
  collectionKey: string;
  onCancel: () => void;
  onSubmit: (values: Values) => Promise<void>;
}) {
  const [values, setValues] = useState<Values>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleUpload(key: string, file: File) {
    setUploadingKey(key);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", collectionKey);
      const result = await uploadImageToGitHub({ data: formData });
      setField(key, result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Values = {};
      for (const field of fields) {
        if (field.type === "list") {
          payload[field.key] = fromTextareaList(String(values[field.key] ?? ""));
        } else if (field.type === "boolean") {
          payload[field.key] = Boolean(values[field.key]);
        } else {
          payload[field.key] = values[field.key] ?? "";
        }
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/40" onClick={onCancel}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-rule shrink-0">
          <h2 className="font-display text-2xl text-ink">Edit entry</h2>
          <button type="button" onClick={onCancel} className="p-1.5 text-ink3 hover:text-ink" aria-label="Close" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          {fields.map((field) => {
            const value = values[field.key];
            return (
              <label key={field.key} className="block">
                <span className="block text-sm font-medium text-ink2 mb-1.5">
                  {field.label}
                  {"required" in field && field.required ? " *" : ""}
                </span>

                {field.type === "text" && (
                  <>
                    <input
                      required={field.required}
                      value={(value as string) ?? ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                    />
                    {field.helper && <p className="text-xs text-ink4 mt-1">{field.helper}</p>}
                  </>
                )}

                {(field.type === "textarea") && (
                  <>
                    <textarea
                      required={field.required}
                      rows={4}
                      value={(value as string) ?? ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                    />
                    {field.helper && <p className="text-xs text-ink4 mt-1">{field.helper}</p>}
                  </>
                )}

                {field.type === "list" && (
                  <>
                    <textarea
                      rows={4}
                      value={toTextareaList(value) || (typeof value === "string" ? value : "")}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                    />
                    {field.helper && <p className="text-xs text-ink4 mt-1">{field.helper}</p>}
                  </>
                )}

                {field.type === "date" && (
                  <>
                    <input
                      type="date"
                      required={field.required}
                      value={(value as string) ?? ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                    />
                    {field.helper && <p className="text-xs text-ink4 mt-1">{field.helper}</p>}
                  </>
                )}

                {field.type === "url" && (
                  <>
                    <input
                      type="url"
                      required={field.required}
                      value={(value as string) ?? ""}
                      onChange={(e) => setField(field.key, e.target.value)}
                      placeholder="https://"
                      className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                    />
                    {field.helper && <p className="text-xs text-ink4 mt-1">{field.helper}</p>}
                  </>
                )}

                {field.type === "image" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required={field.required}
                        value={(value as string) ?? ""}
                        onChange={(e) => setField(field.key, e.target.value)}
                        placeholder="https:// (or upload below)"
                        className="flex-1 border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
                      />
                      <label className="shrink-0 inline-flex items-center gap-1.5 border border-rule hover:border-gold px-3 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wide cursor-pointer transition">
                        <Upload size={13} />
                        {uploadingKey === field.key ? "Uploading…" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingKey === field.key}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleUpload(field.key, file);
                          }}
                        />
                      </label>
                    </div>
                    {value ? (
                      <img src={value as string} alt="" className="h-24 rounded-sm border border-rule object-cover" />
                    ) : null}
                    {field.helper && <p className="text-xs text-ink4">{field.helper}</p>}
                  </div>
                )}

                {field.type === "boolean" && (
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setField(field.key, e.target.checked)}
                    className="h-4 w-4"
                  />
                )}

                {field.type === "select" && (
                  <select
                    required={field.required}
                    value={(value as string) ?? ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition bg-white"
                  >
                    <option value="" disabled>Choose…</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </label>
            );
          })}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-rule flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-rule text-ink2 text-sm font-semibold uppercase tracking-wide py-3 rounded-sm hover:border-g500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-g600 hover:bg-g700 disabled:opacity-60 text-white text-sm font-semibold uppercase tracking-wide py-3 rounded-sm transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
