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

const BUCKET_GROUPS = ["contact", "coordinator", "donate_interest", "newsletter", "opportunity", "program_interest", "givers", "all"] as const;
type BucketGroup = (typeof BUCKET_GROUPS)[number];
const FORM_TYPES = ["contact", "coordinator", "donate_interest", "newsletter", "opportunity", "program_interest"] as const;

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
    opportunity: new Set(),
    program_interest: new Set(),
    givers: new Set(),
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

  // Givers = anyone with a confirmed (paid) Paystack donation.
  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select("email")
    .eq("status", "success");
  if (donationsError) throw new Error(donationsError.message);
  for (const row of donations ?? []) {
    if (typeof row.email !== "string" || !row.email.includes("@")) continue;
    const normalized = row.email.trim().toLowerCase();
    sets.givers.add(normalized);
    sets.all.add(normalized);
  }

  return {
    contact: [...sets.contact],
    coordinator: [...sets.coordinator],
    donate_interest: [...sets.donate_interest],
    newsletter: [...sets.newsletter],
    opportunity: [...sets.opportunity],
    program_interest: [...sets.program_interest],
    givers: [...sets.givers],
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
      opportunity: buckets.opportunity.length,
      program_interest: buckets.program_interest.length,
      givers: buckets.givers.length,
      all: buckets.all.length,
    };
  });

/** Which submission field identifies the opportunity / program a person applied to. */
const TARGET_KEY = { opportunity: "opportunityId", program_interest: "programSlug" } as const;
type TargetedType = keyof typeof TARGET_KEY;
const TARGETED_TYPES = Object.keys(TARGET_KEY) as TargetedType[];

/** Deduped emails per opportunity id / program slug, from the submissions inbox. */
async function fetchTargetEmails(supabase: SupabaseClient, type: TargetedType): Promise<Map<string, Set<string>>> {
  const { data, error } = await supabase.from("form_submissions").select("data").eq("form_type", type);
  if (error) throw new Error(error.message);
  const byTarget = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    const d = (row.data ?? {}) as Record<string, unknown>;
    const id = d[TARGET_KEY[type]];
    const email = d.email;
    if (typeof id !== "string" || typeof email !== "string" || !email.includes("@")) continue;
    if (!byTarget.has(id)) byTarget.set(id, new Set());
    byTarget.get(id)!.add(email.trim().toLowerCase());
  }
  return byTarget;
}

/**
 * Dashboard-only: the opportunities and upcoming programs an admin can pick
 * from once they choose one of those recipient groups, with how many people
 * applied / registered for each.
 */
export const getTargetOptions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const supabase = getSupabaseAdmin();
    const [applicants, registrants, opportunities, programs] = await Promise.all([
      fetchTargetEmails(supabase, "opportunity"),
      fetchTargetEmails(supabase, "program_interest"),
      supabase.from("opportunities").select("id,title").order("sort_order", { ascending: true }),
      supabase.from("upcoming_programs").select("slug,subtitle,event_end_date").order("sort_order", { ascending: true }),
    ]);
    if (opportunities.error) throw new Error(opportunities.error.message);
    if (programs.error) throw new Error(programs.error.message);

    const today = new Date().toISOString().slice(0, 10);
    return {
      opportunities: (opportunities.data ?? []).map((o) => ({
        id: o.id as string,
        title: o.title as string,
        count: applicants.get(o.id as string)?.size ?? 0,
      })),
      programs: (programs.data ?? []).map((p) => ({
        id: p.slug as string,
        title: p.subtitle as string,
        count: registrants.get(p.slug as string)?.size ?? 0,
        past: Boolean(p.event_end_date) && (p.event_end_date as string) < today,
      })),
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
    const targetId = input.get("targetId");
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
      targetId: typeof targetId === "string" && targetId ? targetId : "all",
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
    } else if ((TARGETED_TYPES as readonly string[]).includes(data.recipientType) && data.targetId !== "all") {
      // A specific opportunity or program: only the people who applied / registered for it.
      const byTarget = await fetchTargetEmails(supabase, data.recipientType as TargetedType);
      recipients = [...(byTarget.get(data.targetId) ?? [])];
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
