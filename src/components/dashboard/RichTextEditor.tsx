import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Code2, Eye } from "lucide-react";

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof Bold;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-1.5 rounded-sm text-ink3 hover:text-ink hover:bg-white transition"
    >
      <Icon size={15} />
    </button>
  );
}

/**
 * A minimal WYSIWYG editor (contentEditable + document.execCommand) with a
 * raw-HTML source toggle, so the admin can compose visually or drop in
 * hand-written HTML. No external rich-text library — this app's build has
 * been sensitive to new dependencies, and the formatting needs here (bold,
 * italic, lists, links) are simple enough not to warrant one.
 */
export function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showSource, setShowSource] = useState(false);

  // Sync the contentEditable DOM from `value` only when switching into
  // visual mode (e.g. after editing raw HTML) — never on every keystroke,
  // which would fight the browser for cursor position while typing.
  useEffect(() => {
    if (!showSource && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSource]);

  function exec(command: string, arg?: string) {
    if (document.activeElement !== editorRef.current) editorRef.current?.focus();
    document.execCommand(command, false, arg);
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function insertLink() {
    const url = window.prompt("Link URL (include https://):");
    if (url) exec("createLink", url);
  }

  return (
    <div className="border border-rule rounded-sm overflow-hidden">
      <div className="flex items-center gap-0.5 border-b border-rule bg-g50 px-2 py-1.5 flex-wrap">
        {!showSource && (
          <>
            <ToolbarButton onClick={() => exec("bold")} icon={Bold} label="Bold" />
            <ToolbarButton onClick={() => exec("italic")} icon={Italic} label="Italic" />
            <ToolbarButton onClick={() => exec("underline")} icon={Underline} label="Underline" />
            <ToolbarButton onClick={() => exec("insertUnorderedList")} icon={List} label="Bullet list" />
            <ToolbarButton onClick={() => exec("insertOrderedList")} icon={ListOrdered} label="Numbered list" />
            <ToolbarButton onClick={insertLink} icon={LinkIcon} label="Insert link" />
          </>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowSource((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink3 hover:text-ink px-2 py-1 rounded-sm hover:bg-white transition"
        >
          {showSource ? <Eye size={13} /> : <Code2 size={13} />}
          {showSource ? "Visual" : "HTML"}
        </button>
      </div>

      {showSource ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="w-full px-4 py-3 text-xs font-mono focus:outline-none resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => onChange(editorRef.current?.innerHTML ?? "")}
          className="min-h-[240px] px-4 py-3 text-sm leading-relaxed focus:outline-none [&_a]:text-g700 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        />
      )}
    </div>
  );
}
