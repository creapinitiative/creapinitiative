import { useEffect, useRef, useState } from "react";
import {
  Heading,
  Pilcrow,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  MoveVertical,
  Share2,
  Columns as ColumnsIcon,
  GripVertical,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  Upload,
  X,
  Bookmark,
  Save,
  Blocks,
} from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { uploadImageToGitHub } from "@/api/github-upload";
import { listEmailSections, createEmailSection, removeEmailSection, type EmailSection } from "@/api/email-sections";
import {
  type EmailBlock,
  type BlockType,
  type BlockAlign,
  type NestedColumnBlock,
  BLOCK_LABELS,
  SOCIAL_LINKS,
  makeBlock,
  regenerateIds,
} from "@/lib/email-blocks";

const BLOCK_DEFS: { type: BlockType; icon: typeof Heading }[] = [
  { type: "heading", icon: Heading },
  { type: "paragraph", icon: Pilcrow },
  { type: "image", icon: ImageIcon },
  { type: "button", icon: MousePointerClick },
  { type: "divider", icon: Minus },
  { type: "spacer", icon: MoveVertical },
  { type: "social", icon: Share2 },
  { type: "columns", icon: ColumnsIcon },
];

const NESTED_BLOCK_TYPES = ["heading", "paragraph", "button"] as const;

const fieldClass = "w-full border border-rule rounded-sm px-2.5 py-2 text-xs focus:outline-none focus:border-gold transition bg-white";
const fieldLabelClass = "block text-[11px] font-medium text-ink3 mb-1";

function AlignPicker({ value, onChange, options }: { value: BlockAlign; onChange: (a: BlockAlign) => void; options?: BlockAlign[] }) {
  const opts = options ?? (["left", "center", "right"] as const);
  return (
    <div className="flex gap-1">
      {opts.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(a)}
          className={[
            "flex-1 border rounded-sm py-1.5 text-[10px] font-semibold uppercase tracking-wide transition",
            value === a ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
          ].join(" ")}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

/** A single cell's content inside a Columns block — deliberately simpler than the top-level BlockPreview: no image/divider/spacer/social/nested-columns, so a column never needs its own settings panel. */
function NestedBlockPreview({ block, onUpdate }: { block: NestedColumnBlock; onUpdate: (patch: Record<string, unknown>) => void }) {
  if (block.type === "heading") {
    return (
      <input
        value={block.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Heading"
        className="w-full border-none bg-transparent font-semibold text-sm text-[#0a1a0f] focus:outline-none px-0.5"
      />
    );
  }
  if (block.type === "paragraph") {
    return (
      <textarea
        // Plain text only in a column — embedding the full rich-text editor in a narrow cell isn't usable.
        value={block.html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")}
        onChange={(e) => onUpdate({ html: e.target.value.split("\n").map((l) => l.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)).join("<br/>") })}
        rows={3}
        placeholder="Text…"
        className="w-full border-none bg-transparent text-xs text-ink2 leading-relaxed focus:outline-none resize-none px-0.5"
      />
    );
  }
  return (
    <div className="space-y-1">
      <input value={block.label} onChange={(e) => onUpdate({ label: e.target.value })} placeholder="Button label" className={fieldClass} />
      <input value={block.link} onChange={(e) => onUpdate({ link: e.target.value })} placeholder="https://" className={fieldClass} />
    </div>
  );
}

/** How a block renders inside the canvas. Heading/paragraph are edited in place; the rest are plain previews, edited from the settings panel. */
function BlockPreview({
  block,
  onUpdate,
  uploading,
  onUploadImage,
}: {
  block: EmailBlock;
  onUpdate: (patch: Record<string, unknown>) => void;
  uploading: boolean;
  onUploadImage: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  switch (block.type) {
    case "heading":
      return (
        <input
          value={block.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Your headline here"
          style={{
            fontSize: block.level === "h1" ? "28px" : block.level === "h2" ? "22px" : "18px",
            textAlign: block.align,
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
          className="w-full border-none bg-transparent font-semibold text-[#0a1a0f] focus:outline-none px-1 py-1"
        />
      );

    case "paragraph":
      return <RichTextEditor value={block.html} onChange={(html) => onUpdate({ html })} minHeight={96} />;

    case "image":
      return (
        <div style={{ textAlign: block.align }}>
          {block.src ? (
            <img src={block.src} alt={block.alt} style={{ width: `${block.width}%`, maxWidth: "100%" }} className="rounded-sm inline-block" />
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-rule hover:border-gold rounded-sm py-8 text-ink3 hover:text-ink2 transition flex flex-col items-center gap-2"
            >
              <Upload size={20} />
              <span className="text-xs font-medium">{uploading ? "Uploading…" : "Click to upload an image"}</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadImage(file);
              e.target.value = "";
            }}
          />
        </div>
      );

    case "button":
      return (
        <div style={{ textAlign: block.align }}>
          <div
            style={{ background: block.color }}
            className="inline-block text-white font-semibold text-xs uppercase tracking-wide px-7 py-3 rounded-sm"
          >
            {block.label || "Click here"}
          </div>
        </div>
      );

    case "divider":
      return <hr style={{ borderTop: `${block.thickness}px solid ${block.color}`, margin: `${block.spacing}px 0`, border: "none" }} />;

    case "spacer":
      return (
        <div
          style={{ height: Math.max(block.height, 20) }}
          className="rounded-sm border border-dashed border-rule grid place-items-center text-[10px] text-ink4"
        >
          {block.height}px
        </div>
      );

    case "social":
      return (
        <div style={{ textAlign: block.align }}>
          {SOCIAL_LINKS.map((s) => (
            <img
              key={s.label}
              src={`/email-icons/${s.icon}.png`}
              alt={s.label}
              width={36}
              height={36}
              className="inline-block rounded-full mx-1.5"
            />
          ))}
        </div>
      );

    case "columns": {
      const addToColumn = (colIdx: number, type: (typeof NESTED_BLOCK_TYPES)[number]) => {
        const next = block.columns.map((col, i) => (i === colIdx ? [...col, makeBlock(type) as NestedColumnBlock] : col));
        onUpdate({ columns: next });
      };
      const removeFromColumn = (colIdx: number, id: string) => {
        const next = block.columns.map((col, i) => (i === colIdx ? col.filter((b) => b.id !== id) : col));
        onUpdate({ columns: next });
      };
      const updateInColumn = (colIdx: number, id: string, patch: Record<string, unknown>) => {
        const next = block.columns.map((col, i) =>
          i === colIdx ? col.map((b) => (b.id === id ? ({ ...b, ...patch } as NestedColumnBlock) : b)) : col,
        );
        onUpdate({ columns: next });
      };

      return (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${block.columns.length}, 1fr)` }}>
          {block.columns.map((col, colIdx) => (
            <div key={colIdx} className="border border-dashed border-rule rounded-sm p-2 space-y-2 min-h-[70px]">
              {col.map((nested) => (
                <div key={nested.id} className="group/nested relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromColumn(colIdx, nested.id);
                    }}
                    className="absolute -top-2 -right-2 z-10 hidden group-hover/nested:flex bg-g700 text-white rounded-full p-0.5"
                    aria-label="Remove"
                    title="Remove"
                  >
                    <X size={10} />
                  </button>
                  <NestedBlockPreview block={nested} onUpdate={(patch) => updateInColumn(colIdx, nested.id, patch)} />
                </div>
              ))}
              <div className="flex gap-1">
                {NESTED_BLOCK_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToColumn(colIdx, t);
                    }}
                    className="flex-1 border border-rule hover:border-gold rounded-sm py-1 text-[9px] font-semibold uppercase text-ink3 hover:text-ink2 transition"
                    title={`Add ${BLOCK_LABELS[t]} to this column`}
                  >
                    + {BLOCK_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}

/** The settings panel's content for whichever block is currently selected. */
function BlockSettings({ block, onUpdate }: { block: EmailBlock; onUpdate: (patch: Record<string, unknown>) => void }) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Size</span>
            <div className="flex gap-1">
              {(["h1", "h2", "h3"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onUpdate({ level: lvl })}
                  className={[
                    "flex-1 border rounded-sm py-1.5 text-[11px] font-semibold uppercase transition",
                    block.level === lvl ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
                  ].join(" ")}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className={fieldLabelClass}>Align</span>
            <AlignPicker value={block.align} onChange={(align) => onUpdate({ align })} options={["left", "center"]} />
          </div>
        </div>
      );

    case "paragraph":
      return <p className="text-xs text-ink4">Type directly into the block, and use its toolbar to format text or switch to raw HTML.</p>;

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Image URL</span>
            <input value={block.src} onChange={(e) => onUpdate({ src: e.target.value })} placeholder="https:// (or upload in the canvas)" className={fieldClass} />
          </div>
          <div>
            <span className={fieldLabelClass}>Alt text</span>
            <input value={block.alt} onChange={(e) => onUpdate({ alt: e.target.value })} placeholder="Describes the image" className={fieldClass} />
          </div>
          <div>
            <span className={fieldLabelClass}>Link when clicked (optional)</span>
            <input value={block.link} onChange={(e) => onUpdate({ link: e.target.value })} placeholder="https://" className={fieldClass} />
          </div>
          <div>
            <span className={fieldLabelClass}>Width — {block.width}%</span>
            <input type="range" min={25} max={100} step={5} value={block.width} onChange={(e) => onUpdate({ width: Number(e.target.value) })} className="w-full" />
          </div>
          <div>
            <span className={fieldLabelClass}>Align</span>
            <AlignPicker value={block.align} onChange={(align) => onUpdate({ align })} />
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Label</span>
            <input value={block.label} onChange={(e) => onUpdate({ label: e.target.value })} className={fieldClass} />
          </div>
          <div>
            <span className={fieldLabelClass}>Link</span>
            <input value={block.link} onChange={(e) => onUpdate({ link: e.target.value })} placeholder="https://" className={fieldClass} />
          </div>
          <div>
            <span className={fieldLabelClass}>Color</span>
            <div className="flex items-center gap-2">
              <input type="color" value={block.color} onChange={(e) => onUpdate({ color: e.target.value })} className="h-8 w-10 border border-rule rounded-sm" />
              <div className="flex gap-1.5">
                {["#1f4d2c", "#b8941f"].map((c) => (
                  <button key={c} type="button" onClick={() => onUpdate({ color: c })} style={{ background: c }} className="h-8 w-8 rounded-sm border border-rule" title={c} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className={fieldLabelClass}>Align</span>
            <AlignPicker value={block.align} onChange={(align) => onUpdate({ align })} />
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Color</span>
            <input type="color" value={block.color} onChange={(e) => onUpdate({ color: e.target.value })} className="h-8 w-10 border border-rule rounded-sm" />
          </div>
          <div>
            <span className={fieldLabelClass}>Thickness — {block.thickness}px</span>
            <input type="range" min={1} max={6} value={block.thickness} onChange={(e) => onUpdate({ thickness: Number(e.target.value) })} className="w-full" />
          </div>
          <div>
            <span className={fieldLabelClass}>Spacing above/below — {block.spacing}px</span>
            <input type="range" min={0} max={60} step={4} value={block.spacing} onChange={(e) => onUpdate({ spacing: Number(e.target.value) })} className="w-full" />
          </div>
        </div>
      );

    case "spacer":
      return (
        <div>
          <span className={fieldLabelClass}>Height — {block.height}px</span>
          <input type="range" min={8} max={80} step={4} value={block.height} onChange={(e) => onUpdate({ height: Number(e.target.value) })} className="w-full" />
        </div>
      );

    case "social":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Align</span>
            <AlignPicker value={block.align} onChange={(align) => onUpdate({ align })} />
          </div>
          <p className="text-xs text-ink4">Links to CREAP's own accounts — the same ones shown on the homepage.</p>
        </div>
      );

    case "columns":
      return (
        <div className="space-y-3">
          <div>
            <span className={fieldLabelClass}>Layout</span>
            <div className="flex gap-1">
              {[2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onUpdate({ columns: Array.from({ length: n }, (_, i) => block.columns[i] ?? []) })}
                  className={[
                    "flex-1 border rounded-sm py-1.5 text-[11px] font-semibold uppercase transition",
                    block.columns.length === n ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500",
                  ].join(" ")}
                >
                  {n} columns
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink4">Add a heading, paragraph or button to each column directly in the canvas.</p>
        </div>
      );
  }
}

/**
 * A block-based email builder: a palette of content blocks on the left, a
 * live canvas in the middle (drag blocks to reorder, click to select), and
 * that block's settings on the right — the same shape as Mailchimp's
 * editor, scoped to what a newsletter actually needs. The result is handed
 * up as a plain `EmailBlock[]`; `blocksToHtml` (src/lib/email-blocks.ts)
 * is what turns it into the HTML string that actually gets sent.
 */
export function EmailBuilder({ blocks, onChange }: { blocks: EmailBlock[]; onChange: (blocks: EmailBlock[]) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewWidth, setPreviewWidth] = useState<"desktop" | "mobile">("desktop");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [paletteTab, setPaletteTab] = useState<"blocks" | "saved">("blocks");
  const [sections, setSections] = useState<EmailSection[] | null>(null);
  const [sectionsError, setSectionsError] = useState<string | null>(null);
  const [savingSection, setSavingSection] = useState(false);

  function loadSections() {
    listEmailSections()
      .then(setSections)
      .catch((err) => setSectionsError(err instanceof Error ? err.message : "Could not load saved sections."));
  }
  useEffect(loadSections, []);

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function update(id: string, patch: Record<string, unknown>) {
    onChange(blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as EmailBlock) : b)));
  }

  function addBlock(type: BlockType) {
    const block = makeBlock(type);
    onChange([...blocks, block]);
    setSelectedId(block.id);
  }

  function remove(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function duplicate(id: string) {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const [copy] = regenerateIds([blocks[idx]]);
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    onChange(next);
  }

  async function saveCurrentAsSection() {
    if (blocks.length === 0) return;
    const name = window.prompt("Name this section (e.g. \"Standard footer\"):")?.trim();
    if (!name) return;
    setSavingSection(true);
    setSectionsError(null);
    try {
      await createEmailSection({ data: { name, blocks: blocks as unknown as Record<string, unknown>[] } });
      loadSections();
    } catch (err) {
      setSectionsError(err instanceof Error ? err.message : "Could not save this section.");
    } finally {
      setSavingSection(false);
    }
  }

  function insertSection(section: EmailSection) {
    const inserted = regenerateIds(section.blocks as unknown as EmailBlock[]);
    onChange([...blocks, ...inserted]);
  }

  async function deleteSection(section: EmailSection) {
    if (!window.confirm(`Delete the saved section "${section.name}"? This can't be undone.`)) return;
    try {
      await removeEmailSection({ data: { id: section.id } });
      loadSections();
    } catch (err) {
      setSectionsError(err instanceof Error ? err.message : "Could not delete this section.");
    }
  }

  function move(id: string, direction: -1 | 1) {
    const idx = blocks.findIndex((b) => b.id === id);
    const target = idx + direction;
    if (idx === -1 || target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...blocks];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  async function uploadImage(id: string, file: File) {
    setUploadingId(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("collection", "messaging");
      const res = await uploadImageToGitHub({ data: fd });
      update(id, { src: res.url });
    } catch {
      // The field just stays empty — the admin can paste a link instead.
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4" onClick={() => setSelectedId(null)}>
      {/* Block palette */}
      <div className="lg:w-44 shrink-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1 border border-rule rounded-sm p-0.5 bg-g50 mb-2">
          {(
            [
              ["blocks", "Blocks", Blocks],
              ["saved", "Saved", Bookmark],
            ] as const
          ).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPaletteTab(value)}
              className={[
                "flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-sm text-[11px] font-semibold uppercase tracking-wide transition",
                paletteTab === value ? "bg-white text-ink shadow-sm" : "text-ink3 hover:text-ink",
              ].join(" ")}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {paletteTab === "blocks" ? (
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-2 gap-1.5">
            {BLOCK_DEFS.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="flex flex-col items-center gap-1 border border-rule hover:border-gold hover:bg-g50 rounded-sm py-2.5 text-ink2 transition"
                title={`Add ${BLOCK_LABELS[type]}`}
              >
                <Icon size={16} />
                <span className="text-[10px] font-medium leading-tight text-center">{BLOCK_LABELS[type]}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => void saveCurrentAsSection()}
              disabled={savingSection || blocks.length === 0}
              className="w-full inline-flex items-center justify-center gap-1.5 border border-rule hover:border-gold disabled:opacity-50 rounded-sm py-2 text-[11px] font-semibold uppercase tracking-wide text-ink2 transition"
            >
              <Save size={12} /> {savingSection ? "Saving…" : "Save this email"}
            </button>
            {sectionsError && <p className="text-[11px] text-red-600">{sectionsError}</p>}
            {sections === null && !sectionsError && <p className="text-[11px] text-ink4">Loading…</p>}
            {sections !== null && sections.length === 0 && (
              <p className="text-[11px] text-ink4">Nothing saved yet — build an email, then "Save this email" to reuse it later.</p>
            )}
            {sections?.map((s) => (
              <div key={s.id} className="border border-rule rounded-sm px-2 py-1.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => insertSection(s)}
                  className="flex-1 min-w-0 text-left"
                  title={`Insert "${s.name}"`}
                >
                  <p className="text-[11px] font-medium text-ink truncate">{s.name}</p>
                  <p className="text-[10px] text-ink4">{s.blocks.length} block{s.blocks.length === 1 ? "" : "s"}</p>
                </button>
                <button
                  type="button"
                  onClick={() => void deleteSection(s)}
                  className="p-1 text-ink4 hover:text-red-600 shrink-0"
                  aria-label={`Delete "${s.name}"`}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1 mb-2">
          <button
            type="button"
            onClick={() => setPreviewWidth("desktop")}
            className={`p-1.5 rounded-sm border transition ${previewWidth === "desktop" ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500"}`}
            aria-label="Desktop width"
            title="Desktop width"
          >
            <Monitor size={14} />
          </button>
          <button
            type="button"
            onClick={() => setPreviewWidth("mobile")}
            className={`p-1.5 rounded-sm border transition ${previewWidth === "mobile" ? "bg-g600 text-white border-g600" : "border-rule text-ink3 hover:border-g500"}`}
            aria-label="Mobile width"
            title="Mobile width"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <div className="bg-g50 border border-rule rounded-sm p-4 sm:p-6 overflow-y-auto max-h-[560px]">
          <div
            className="bg-white mx-auto shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-[max-width] duration-200"
            // 560px matches the actual email's content width (see wrapper() in src/api/email-templates.ts), so this preview is pixel-accurate.
            style={{ maxWidth: previewWidth === "mobile" ? 375 : 560 }}
          >
            <div className="p-5 sm:p-7">
              {blocks.length === 0 && (
                <p className="text-sm text-ink4 text-center py-16">Add a block from the left to start building the email.</p>
              )}
              {blocks.map((block, i) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => (dragIndex.current = i)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(i);
                  }}
                  onDragLeave={() => setDragOverIndex((p) => (p === i ? null : p))}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex.current !== null) reorder(dragIndex.current, i);
                    dragIndex.current = null;
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    dragIndex.current = null;
                    setDragOverIndex(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(block.id);
                  }}
                  className={[
                    "group relative mb-1 rounded-sm transition cursor-pointer",
                    selectedId === block.id ? "ring-2 ring-gold/70" : "hover:ring-1 hover:ring-g300",
                    dragOverIndex === i ? "border-t-2 border-gold" : "",
                  ].join(" ")}
                >
                  <div className="absolute -top-3 right-1.5 z-10 hidden group-hover:flex items-center gap-0.5 bg-g700 rounded-sm shadow-sm px-1 py-0.5">
                    <span className="cursor-grab text-white/70 px-1" title="Drag to reorder">
                      <GripVertical size={12} />
                    </span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); move(block.id, -1); }} className="text-white/70 hover:text-white p-1" aria-label="Move up" title="Move up">
                      <ChevronUp size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); move(block.id, 1); }} className="text-white/70 hover:text-white p-1" aria-label="Move down" title="Move down">
                      <ChevronDown size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); duplicate(block.id); }} className="text-white/70 hover:text-white p-1" aria-label="Duplicate" title="Duplicate">
                      <Copy size={12} />
                    </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); remove(block.id); }} className="text-white/70 hover:text-red-300 p-1" aria-label="Delete" title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <BlockPreview
                    block={block}
                    onUpdate={(patch) => update(block.id, patch)}
                    uploading={uploadingId === block.id}
                    onUploadImage={(file) => uploadImage(block.id, file)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <div className="lg:w-56 shrink-0" onClick={(e) => e.stopPropagation()}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink4 mb-2">
          {selected ? `${BLOCK_LABELS[selected.type]} settings` : "Block settings"}
        </p>
        <div className="border border-rule rounded-sm bg-white p-3.5 min-h-[160px]">
          {!selected && <p className="text-xs text-ink4">Click a block in the canvas to edit it here.</p>}
          {selected && <BlockSettings block={selected} onUpdate={(patch) => update(selected.id, patch)} />}
        </div>
      </div>
    </div>
  );
}
