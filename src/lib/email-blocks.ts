/**
 * The data model behind the dashboard's drag-and-drop email builder
 * (Messaging → Email builder). Each block is a plain object the builder UI
 * edits directly; `blocksToHtml` is the only place that turns them into the
 * actual HTML string that gets sent, so the builder and the "Simple"
 * rich-text mode can both hand the same kind of HTML string off to
 * `sendAdminEmail` without the server knowing which mode produced it.
 *
 * Kept intentionally plain (inline-styled divs, not a table layout) to
 * match the HTML `wrapper()` already used for every other email this app
 * sends (src/api/email-templates.ts) — consistent rendering across every
 * email, at the cost of pixel-perfect behavior in the oldest Outlook
 * versions, which this app has never specifically targeted.
 */

export type BlockAlign = "left" | "center" | "right";

export type HeadingBlock = { id: string; type: "heading"; text: string; level: "h1" | "h2" | "h3"; align: BlockAlign };
export type ParagraphBlock = { id: string; type: "paragraph"; html: string };
export type ImageBlock = { id: string; type: "image"; src: string; alt: string; link: string; width: number; align: BlockAlign };
export type ButtonBlock = { id: string; type: "button"; label: string; link: string; color: string; align: BlockAlign };
export type DividerBlock = { id: string; type: "divider"; color: string; thickness: number; spacing: number };
export type SpacerBlock = { id: string; type: "spacer"; height: number };
export type SocialBlock = { id: string; type: "social"; align: BlockAlign };

export type EmailBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ButtonBlock
  | DividerBlock
  | SpacerBlock
  | SocialBlock;

export type BlockType = EmailBlock["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  button: "Button",
  divider: "Divider",
  spacer: "Spacer",
  social: "Social links",
};

/** The org's social accounts — same links used on the homepage's "Follow Our Journey" band. */
export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/share/16BhHZR317/" },
  { label: "Instagram", href: "https://www.instagram.com/creapafricainitiative" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/creap-africa-initiative/" },
  { label: "X", href: "https://x.com/creapafrica" },
  { label: "YouTube", href: "https://youtube.com/@creapafricainitiative" },
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export function makeBlock(type: BlockType): EmailBlock {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, text: "Your headline here", level: "h2", align: "left" };
    case "paragraph":
      return { id, type, html: "Write your message here…" };
    case "image":
      return { id, type, src: "", alt: "", link: "", width: 100, align: "center" };
    case "button":
      return { id, type, label: "Click here", link: "https://", color: "#1f4d2c", align: "left" };
    case "divider":
      return { id, type, color: "#e5e8e5", thickness: 1, spacing: 24 };
    case "spacer":
      return { id, type, height: 24 };
    case "social":
      return { id, type, align: "center" };
  }
}

export function defaultBlocks(): EmailBlock[] {
  return [makeBlock("heading"), makeBlock("paragraph")];
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const HEADING_SIZE: Record<HeadingBlock["level"], string> = { h1: "28px", h2: "22px", h3: "18px" };

function blockToHtml(block: EmailBlock): string {
  switch (block.type) {
    case "heading":
      return `<${block.level} style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:${HEADING_SIZE[block.level]};line-height:1.3;color:#0a1a0f;text-align:${block.align};">${escapeHtml(block.text)}</${block.level}>`;

    case "paragraph":
      return `<div style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#2b2b2b;">${block.html}</div>`;

    case "image": {
      if (!block.src) return "";
      const img = `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" style="display:block;width:${block.width}%;max-width:100%;border-radius:4px;margin:${block.align === "center" ? "0 auto" : "0"};" />`;
      const wrapped = block.link
        ? `<a href="${escapeHtml(block.link)}" target="_blank" rel="noopener noreferrer">${img}</a>`
        : img;
      return `<div style="margin:0 0 16px;text-align:${block.align};">${wrapped}</div>`;
    }

    case "button":
      return `<div style="margin:0 0 16px;text-align:${block.align};"><a href="${escapeHtml(block.link)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${block.color};color:#ffffff;font-weight:600;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:4px;">${escapeHtml(block.label)}</a></div>`;

    case "divider":
      return `<hr style="margin:${block.spacing}px 0;border:none;border-top:${block.thickness}px solid ${block.color};" />`;

    case "spacer":
      return `<div style="height:${block.height}px;line-height:${block.height}px;font-size:1px;">&nbsp;</div>`;

    case "social":
      return `<div style="margin:0 0 16px;text-align:${block.align};font-size:12px;">${SOCIAL_LINKS.map(
        (s) =>
          `<a href="${s.href}" target="_blank" rel="noopener noreferrer" style="color:#8a6d1f;text-decoration:none;font-weight:600;margin:0 8px;">${s.label}</a>`,
      ).join("")}</div>`;
  }
}

export function blocksToHtml(blocks: EmailBlock[]): string {
  return blocks.map(blockToHtml).join("\n");
}
