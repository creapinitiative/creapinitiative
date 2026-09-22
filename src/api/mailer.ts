import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin } from "@/api/supabase-admin";
import { getResend } from "@/api/resend-client";
import { wrapper } from "@/api/email-templates";

/**
 * Admin mailer: send a one-off message to an individual address, or to
 * everyone who has ever submitted a given form (deduped by email), pulled
 * straight from `form_submissions` — there's no separate subscriber list to
 * keep in sync. Every group send goes out as individual emails (never a
 * shared `to`/`cc`), so recipients never see each other's addresses.
 */

const BUCKET_GROUPS = ["contact", "coordinator", "donate_interest", "newsletter", "all"] as const;
type BucketGroup = (typeof BUCKET_GROUPS)[number];
const FORM_TYPES = ["contact", "coordinator", "donate_interest", "newsletter"] as const;

const RECIPIENT_TYPES = [...BUCKET_GROUPS, "individual"] as const;
type RecipientType = (typeof RECIPIENT_TYPES)[number];

async function fetchEmailBuckets(supabase: SupabaseClient): Promise<Record<BucketGroup, string[]>> {
  const { data, error } = await supabase.from("form_submissions").select("form_type,data");
  if (error) throw new Error(error.message);

  const sets: Record<BucketGroup, Set<string>> = {
    contact: new Set(),
    coordinator: new Set(),
    donate_interest: new Set(),
    newsletter: new Set(),
    all: new Set(),
  };

  for (const row of data ?? []) {
    const email = (row.data as Record<string, unknown> | null)?.email;
    if (typeof email !== "string" || !email.includes("@")) continue;
    const normalized = email.trim().toLowerCase();
    const formType = row.form_type as (typeof FORM_TYPES)[number];
    if (FORM_TYPES.includes(formType)) sets[formType].add(normalized);
    sets.all.add(normalized);
  }

  return {
    contact: [...sets.contact],
    coordinator: [...sets.coordinator],
    donate_interest: [...sets.donate_interest],
    newsletter: [...sets.newsletter],
    all: [...sets.all],
  };
}

/** Dashboard-only: recipient counts per group, shown before composing/sending. */
export const getRecipientCounts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const supabase = getSupabaseAdmin();
    const buckets = await fetchEmailBuckets(supabase);
    return {
      contact: buckets.contact.length,
      coordinator: buckets.coordinator.length,
      donate_interest: buckets.donate_interest.length,
      newsletter: buckets.newsletter.length,
      all: buckets.all.length,
    };
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sendAdminEmail = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Expected FormData");

    const recipientType = input.get("recipientType");
    const customEmails = input.get("customEmails");
    const subject = input.get("subject");
    const html = input.get("html");
    const attachments = input.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);

    if (typeof recipientType !== "string" || !RECIPIENT_TYPES.includes(recipientType as RecipientType)) {
      throw new Error("Invalid recipient type");
    }
    if (typeof subject !== "string" || !subject.trim()) throw new Error("Subject is required");
    if (typeof html !== "string" || !html.trim()) throw new Error("Message body is required");

    return {
      recipientType: recipientType as RecipientType,
      customEmails: typeof customEmails === "string" ? customEmails : "",
      subject: subject.trim(),
      html,
      attachments,
    };
  })
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    if (!fromEmail) throw new Error("RESEND_FROM_EMAIL is not configured.");

    let recipients: string[];
    if (data.recipientType === "individual") {
      recipients = data.customEmails
        .split(/[\n,]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0);

      const invalid = recipients.filter((e) => !EMAIL_RE.test(e));
      if (invalid.length > 0) throw new Error(`Invalid email address(es): ${invalid.join(", ")}`);
    } else {
      const buckets = await fetchEmailBuckets(supabase);
      recipients = buckets[data.recipientType];
    }

    recipients = [...new Set(recipients)];
    if (recipients.length === 0) throw new Error("No recipients found for this selection.");

    const attachments = await Promise.all(
      data.attachments.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      })),
    );

    const htmlBody = wrapper(data.html);
    let sent = 0;
    const failed: string[] = [];

    const CHUNK_SIZE = 2;
    for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
      const chunk = recipients.slice(i, i + CHUNK_SIZE);
      const results = await Promise.allSettled(
        chunk.map((to) =>
          resend.emails.send({
            from: fromEmail,
            to,
            subject: data.subject,
            html: htmlBody,
            attachments: attachments.length > 0 ? attachments : undefined,
          }),
        ),
      );
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") sent++;
        else failed.push(chunk[idx]);
      });
      if (i + CHUNK_SIZE < recipients.length) await sleep(600);
    }

    return { sent, failed, total: recipients.length };
  });
