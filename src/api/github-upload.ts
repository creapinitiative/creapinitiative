import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/api/auth-middleware";

function slugifyFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "jpg";
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "image"}.${ext}`;
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

/**
 * Uploads an image straight into the GitHub repo via the Contents API, and
 * returns its raw.githubusercontent.com URL — live immediately, independent
 * of the next Cloudflare Pages deploy. Used by the dashboard's image fields
 * as an alternative to pasting an external URL directly. No Supabase Storage
 * involved at all (see the plan: PDFs are link-only, images go to GitHub).
 */
export const uploadImageToGitHub = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Expected FormData");
    const file = input.get("file");
    const collection = input.get("collection");
    if (!(file instanceof File)) throw new Error("Missing file");
    if (typeof collection !== "string" || !collection) throw new Error("Missing collection");
    return { file, collection };
  })
  .handler(async ({ data: { file, collection } }) => {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;

    if (!token || !owner || !repo) {
      throw new Error("GitHub upload is not configured. Set GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO.");
    }

    const filename = `${Date.now()}-${slugifyFilename(file.name)}`;
    const path = `public/uploads/${collection}/${filename}`;
    const content = await fileToBase64(file);

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "creap-dashboard",
        },
        body: JSON.stringify({
          message: `Upload ${collection} image: ${filename}`,
          content,
          branch: "main",
        }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub upload failed (${res.status}): ${body}`);
    }

    return { url: `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}` };
  });
