/**
 * Turns a raw thrown error into plain-English sentences fit to show a
 * non-technical admin or visitor.
 *
 * Server functions validate input with Zod, and a failed `.parse()` throws
 * an Error whose `message` is a JSON-encoded array of issues, e.g.
 * `[{"path":["slug"],"message":"..."}]`. Left as-is, that shows up as raw
 * code in the UI. This decodes it into "<Field>: <reason>" sentences
 * instead. `fieldLabels` maps a schema key (e.g. "slug") to the label shown
 * on the form (e.g. "Slug"), so the message matches what the person sees;
 * an unmapped key falls back to a readable guess from the key itself.
 */

type ZodIssueLike = { path?: (string | number)[]; message?: string };

function camelToWords(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .trim();
}

const ACRONYMS = new Set(["cv", "id", "url", "cta"]);

function defaultLabel(key: string): string {
  const words = camelToWords(key).split(" ").filter(Boolean);
  if (words.length === 0) return key;
  return words
    .map((w, i) => (ACRONYMS.has(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function friendlyErrorMessage(err: unknown, fieldLabels?: Record<string, string>): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "Something went wrong.";
  const trimmed = raw.trim();

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const issues: ZodIssueLike[] = Array.isArray(parsed) ? parsed : [parsed];
      const sentences = issues
        .map((issue) => {
          const msg = issue.message?.trim();
          if (!msg) return null;
          const key = issue.path?.[issue.path.length - 1];
          if (typeof key !== "string") return msg;
          const label = fieldLabels?.[key] ?? defaultLabel(key);
          return `${label}: ${msg}`;
        })
        .filter((s): s is string => Boolean(s));
      if (sentences.length > 0) return sentences.join(" ");
    } catch {
      // Not JSON after all — fall through and show the raw text.
    }
  }

  return raw || "Something went wrong. Please try again.";
}
