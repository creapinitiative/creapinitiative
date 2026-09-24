import { useState } from "react";
import { Upload, X, Eye, EyeOff } from "lucide-react";
import type { HeroSlide } from "@/api/collections";
import { uploadImageToGitHub } from "@/api/github-upload";

export type SlideValues = Omit<HeroSlide, "id" | "sort_order">;

const EMPTY: SlideValues = {
  image_url: "",
  eyebrow: "",
  title: "",
  highlight: "",
  body: "",
  cta1_label: "",
  cta1_link: "",
  cta2_label: "",
  cta2_link: "",
  active: true,
};

const PAGES = [
  { value: "/about", label: "About" },
  { value: "/programs/our-key-programs", label: "Our Key Programs" },
  { value: "/programs/upcoming-programs", label: "Upcoming Programs" },
  { value: "/resources/policy-briefs", label: "Policy Briefs" },
  { value: "/resources/blogs", label: "Blogs" },
  { value: "/reports/annual-reports", label: "Annual Reports" },
  { value: "/leadership", label: "Leadership" },
  { value: "/get-involved", label: "Get Involved" },
  { value: "/opportunities", label: "Opportunities" },
  { value: "/donate", label: "Donate" },
  { value: "/contact", label: "Contact" },
];
const CUSTOM = "__custom__";

const inputClass =
  "w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition bg-white";

/** "Link to" dropdown of site pages, with an "Other" choice for any URL. */
function LinkPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isKnown = PAGES.some((p) => p.value === value);
  const [custom, setCustom] = useState(Boolean(value) && !isKnown);
  return (
    <div className="space-y-2">
      <select
        value={custom ? CUSTOM : value}
        onChange={(e) => {
          if (e.target.value === CUSTOM) {
            setCustom(true);
            onChange("");
          } else {
            setCustom(false);
            onChange(e.target.value);
          }
        }}
        className={inputClass}
      >
        <option value="">Choose a page…</option>
        {PAGES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
        <option value={CUSTOM}>Other (paste a link)…</option>
      </select>
      {custom && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /page-path"
          className={inputClass}
        />
      )}
    </div>
  );
}

function Field({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-sm font-medium text-ink2 mb-1.5">{label}</span>
      {children}
      {helper && <p className="text-xs text-ink4 mt-1">{helper}</p>}
    </div>
  );
}

/** A miniature of the real hero, updating as the admin types. */
function Preview({ v }: { v: SlideValues }) {
  return (
    <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-g900 border border-rule">
      {v.image_url && <img src={v.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(105deg, rgba(8,20,12,0.88) 0%, rgba(8,20,12,0.45) 55%, rgba(8,20,12,0.25) 100%)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
        {v.eyebrow && <p className="text-[8px] sm:text-[9px] tracking-[0.18em] uppercase text-gold3 mb-1.5">{v.eyebrow}</p>}
        <p className="font-display text-white text-lg sm:text-2xl leading-tight">
          {v.title || <span className="text-white/40">Your headline</span>}
          {v.highlight && <> <em className="text-goldf italic">{v.highlight}</em></>}
        </p>
        {v.body && <p className="text-white/75 text-[10px] sm:text-xs mt-1.5 line-clamp-2 max-w-[80%]">{v.body}</p>}
        {(v.cta1_label || v.cta2_label) && (
          <div className="flex gap-1.5 mt-2.5">
            {v.cta1_label && <span className="bg-gold text-g900 text-[8px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-sm">{v.cta1_label}</span>}
            {v.cta2_label && <span className="border border-white/50 text-white text-[8px] uppercase tracking-wider px-2.5 py-1 rounded-sm">{v.cta2_label}</span>}
          </div>
        )}
      </div>
      {!v.image_url && (
        <p className="absolute inset-0 grid place-items-center text-white/40 text-xs">Add an image to see the preview</p>
      )}
    </div>
  );
}

export function HeroSlideEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: SlideValues | null;
  onCancel: () => void;
  onSave: (values: SlideValues) => Promise<void>;
}) {
  const [v, setV] = useState<SlideValues>(initial ?? EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof SlideValues>(key: K, value: SlideValues[K]) => setV((p) => ({ ...p, [key]: value }));

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("collection", "hero-slides");
      const res = await uploadImageToGitHub({ data: fd });
      set("image_url", res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!v.image_url.trim()) return setError("Please add a slide image.");
    if (!v.title.trim()) return setError("Please add a headline.");
    // A button needs both a label and a destination.
    for (const n of ["1", "2"] as const) {
      const label = v[`cta${n}_label`]?.trim();
      const link = v[`cta${n}_link`]?.trim();
      if (label && !link) return setError(`Button ${n} has a label but no link.`);
      if (link && !label) return setError(`Button ${n} has a link but no label.`);
    }
    setSaving(true);
    try {
      await onSave(v);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the slide.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-black/40" onClick={onCancel}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-rule shrink-0">
          <h2 className="font-display text-2xl text-ink">{initial ? "Edit slide" : "New slide"}</h2>
          <button type="button" onClick={onCancel} className="p-1.5 text-ink3 hover:text-ink" aria-label="Close" title="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink4 mb-2">Live preview</p>
            <Preview v={v} />
          </div>

          <Field label="Slide image *" helper="Wide, high-quality photos work best (at least 1600px across).">
            <div className="flex gap-2">
              <input
                value={v.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="Paste an image link or upload →"
                className={`flex-1 ${inputClass}`}
              />
              <label className="shrink-0 inline-flex items-center gap-1.5 border border-rule hover:border-gold px-3 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wide cursor-pointer transition">
                <Upload size={13} /> {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </Field>

          <Field label="Small label" helper="The short line above the headline, e.g. “Climate & Environment”.">
            <input value={v.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} className={inputClass} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Headline *">
              <input value={v.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="Greening Futures," />
            </Field>
            <Field label="Highlighted words" helper="Shown in gold italics after the headline.">
              <input value={v.highlight ?? ""} onChange={(e) => set("highlight", e.target.value)} className={inputClass} placeholder="Building Climate Resilience" />
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} value={v.body ?? ""} onChange={(e) => set("body", e.target.value)} className={inputClass} />
          </Field>

          <div className="rounded-sm border border-rule p-4 space-y-4">
            <p className="text-sm font-semibold text-ink">Button 1 <span className="font-normal text-ink4">(gold)</span></p>
            <Field label="Label">
              <input value={v.cta1_label ?? ""} onChange={(e) => set("cta1_label", e.target.value)} className={inputClass} placeholder="Get Involved" />
            </Field>
            <Field label="Link to">
              <LinkPicker value={v.cta1_link ?? ""} onChange={(x) => set("cta1_link", x)} />
            </Field>
          </div>

          <div className="rounded-sm border border-rule p-4 space-y-4">
            <p className="text-sm font-semibold text-ink">Button 2 <span className="font-normal text-ink4">(outlined, optional)</span></p>
            <Field label="Label">
              <input value={v.cta2_label ?? ""} onChange={(e) => set("cta2_label", e.target.value)} className={inputClass} placeholder="Learn more" />
            </Field>
            <Field label="Link to">
              <LinkPicker value={v.cta2_link ?? ""} onChange={(x) => set("cta2_link", x)} />
            </Field>
          </div>

          <button
            type="button"
            onClick={() => set("active", !v.active)}
            className={[
              "w-full flex items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left transition",
              v.active ? "border-g500 bg-g50" : "border-rule",
            ].join(" ")}
          >
            <span className="flex items-center gap-2.5 text-sm text-ink2">
              {v.active ? <Eye size={16} className="text-g600" /> : <EyeOff size={16} className="text-ink4" />}
              {v.active ? "Visible on the homepage" : "Hidden — saved but not shown"}
            </span>
            <span className={["relative h-5 w-9 rounded-full transition", v.active ? "bg-g600" : "bg-ink4/40"].join(" ")}>
              <span className={["absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", v.active ? "left-[18px]" : "left-0.5"].join(" ")} />
            </span>
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-rule flex gap-3 shrink-0">
          <button type="button" onClick={onCancel} className="flex-1 border border-rule text-ink2 text-sm font-semibold uppercase tracking-wide py-3 rounded-sm hover:border-g500 transition">
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="flex-1 bg-g600 hover:bg-g700 disabled:opacity-60 text-white text-sm font-semibold uppercase tracking-wide py-3 rounded-sm transition">
            {saving ? "Saving…" : "Save slide"}
          </button>
        </div>
      </form>
    </div>
  );
}
