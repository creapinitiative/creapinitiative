import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, X, Loader2 } from "lucide-react";
import { getRecipientCounts, sendAdminEmail } from "@/api/mailer";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";

export const Route = createFileRoute("/dashboard/messaging")({
  component: MessagingPage,
});

const RECIPIENT_OPTIONS = [
  { value: "individual", label: "Individual email(s)" },
  { value: "all", label: "Everyone (all submissions)" },
  { value: "newsletter", label: "Newsletter subscribers" },
  { value: "contact", label: "Contact form submitters" },
  { value: "coordinator", label: "State coordinator applicants" },
  { value: "donate_interest", label: "Donation interest" },
] as const;

type RecipientValue = (typeof RECIPIENT_OPTIONS)[number]["value"];
type Counts = Record<Exclude<RecipientValue, "individual">, number>;

type SendResult = { sent: number; failed: string[]; total: number };

function MessagingPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [countsError, setCountsError] = useState<string | null>(null);

  const [recipientType, setRecipientType] = useState<RecipientValue>("individual");
  const [customEmails, setCustomEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRecipientCounts()
      .then((c) => setCounts(c as Counts))
      .catch((err) => setCountsError(err instanceof Error ? err.message : "Failed to load recipient counts."));
  }, []);

  function recipientCount(): number | null {
    if (recipientType === "individual") {
      const n = customEmails.split(/[\n,]+/).map((e) => e.trim()).filter(Boolean).length;
      return n;
    }
    return counts?.[recipientType] ?? null;
  }

  function addFiles(files: File[]) {
    if (files.length === 0) return;
    setAttachments((prev) => [...prev, ...files]);
  }

  function removeFile(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSend() {
    setError(null);
    setResult(null);

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!html.trim()) {
      setError("Message body is required.");
      return;
    }

    const count = recipientCount();
    const label = RECIPIENT_OPTIONS.find((o) => o.value === recipientType)?.label ?? recipientType;
    const confirmed = window.confirm(
      `Send this email to ${count ?? "an unknown number of"} recipient(s) (${label})?`,
    );
    if (!confirmed) return;

    setSending(true);
    try {
      const formData = new FormData();
      formData.set("recipientType", recipientType);
      formData.set("customEmails", customEmails);
      formData.set("subject", subject);
      formData.set("html", html);
      for (const file of attachments) formData.append("attachments", file);

      const res = await sendAdminEmail({ data: formData });
      setResult(res as SendResult);
      if ((res as SendResult).failed.length === 0) {
        setSubject("");
        setHtml("");
        setCustomEmails("");
        setAttachments([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  const count = recipientCount();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl sm:text-3xl text-ink mb-1">Messaging</h1>
      <p className="text-ink3 mb-6 text-sm sm:text-base">
        Send a one-off email to an individual address or to everyone who's ever submitted a form on the site.
      </p>

      <div className="bg-white border border-rule rounded-sm p-5 sm:p-6 space-y-5">
        <p className="text-xs text-ink4">
          Sending from <span className="font-medium text-ink2">Creap Initiative &lt;mail@creapinitiative.org&gt;</span>
        </p>

        <div>
          <span className="block text-sm font-medium text-ink2 mb-2">Send to</span>
          <div className="grid sm:grid-cols-2 gap-2">
            {RECIPIENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={[
                  "flex items-center justify-between gap-2 border rounded-sm px-3 py-2.5 text-sm cursor-pointer transition",
                  recipientType === opt.value ? "border-g500 bg-g50" : "border-rule hover:border-g300",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="recipientType"
                    checked={recipientType === opt.value}
                    onChange={() => setRecipientType(opt.value)}
                  />
                  {opt.label}
                </span>
                {opt.value !== "individual" && (
                  <span className="text-xs text-ink4 shrink-0">
                    {countsError ? "—" : counts ? counts[opt.value] : "…"}
                  </span>
                )}
              </label>
            ))}
          </div>
          {countsError && <p className="text-xs text-red-600 mt-2">{countsError}</p>}
        </div>

        {recipientType === "individual" && (
          <label className="block">
            <span className="block text-sm font-medium text-ink2 mb-1.5">Email address(es)</span>
            <textarea
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              rows={3}
              placeholder="One per line, or comma-separated"
              className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
            />
          </label>
        )}

        <label className="block">
          <span className="block text-sm font-medium text-ink2 mb-1.5">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
          />
        </label>

        <div>
          <span className="block text-sm font-medium text-ink2 mb-1.5">Message</span>
          <RichTextEditor value={html} onChange={setHtml} />
        </div>

        <div>
          <span className="block text-sm font-medium text-ink2 mb-1.5">Attachments</span>
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, idx) => (
              <span
                key={`${file.name}-${idx}`}
                className="inline-flex items-center gap-1.5 text-xs bg-g50 border border-rule rounded-sm pl-2.5 pr-1.5 py-1.5"
              >
                <Paperclip size={11} className="text-ink4" />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <button type="button" onClick={() => removeFile(idx)} className="text-ink4 hover:text-red-600" aria-label={`Remove ${file.name}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-sm transition"
          >
            <Paperclip size={13} /> Add files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {result && (
          <p className={result.failed.length > 0 ? "text-sm text-amber-700" : "text-sm text-g600"}>
            Sent {result.sent} of {result.total}.
            {result.failed.length > 0 && ` Failed: ${result.failed.join(", ")}`}
          </p>
        )}

        <button
          onClick={handleSend}
          disabled={sending || count === 0}
          className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-wide px-5 py-3 rounded-sm transition"
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {sending ? "Sending…" : `Send${count ? ` to ${count}` : ""}`}
        </button>
      </div>
    </div>
  );
}
