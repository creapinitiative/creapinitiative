import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin, tryGetSupabaseAdmin } from "@/api/supabase-admin";
import { tryGetResend } from "@/api/resend-client";
import { confirmationEmail, notificationEmail } from "@/api/email-templates";

const contactSchema = z.object({
  formType: z.literal("contact"),
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional().or(z.literal("")),
  message: z.string().min(1),
});

const newsletterSchema = z.object({
  formType: z.literal("newsletter"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

const opportunitySchema = z.object({
  formType: z.literal("opportunity"),
  opportunityId: z.string().min(1),
  opportunityTitle: z.string().min(1),
  opportunityCategory: z.string().optional().or(z.literal("")),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  state: z.string().optional().or(z.literal("")),
  cvLink: z.string().url().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

const programInterestSchema = z.object({
  formType: z.literal("program_interest"),
  programSlug: z.string().min(1),
  programTitle: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  organisation: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
});

const submissionSchema = z.discriminatedUnion("formType", [
  contactSchema,
  newsletterSchema,
  opportunitySchema,
  programInterestSchema,
]);

/**
 * The single entry point every public form posts to: validates, persists to
 * `form_submissions`, then sends both emails via Resend. Email failures are
 * logged but never block the submission from being recorded — the row in
 * Supabase is the source of truth, email is best-effort delivery on top.
 */
export const submitForm = createServerFn({ method: "POST" })
  .validator(submissionSchema)
  .handler(async ({ data }) => {
    const { formType, ...rest } = data;
    const supabase = tryGetSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.from("form_submissions").insert({
        form_type: formType,
        data: rest,
      });
      if (error) throw new Error(error.message);
    }

    const resend = tryGetResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const submitterEmail = (rest as { email?: string }).email;

    if (resend && fromEmail) {
      const results = await Promise.allSettled([
        submitterEmail
          ? resend.emails.send({
              from: fromEmail,
              to: submitterEmail,
              ...confirmationEmail(formType, rest),
            })
          : Promise.resolve(),
        adminEmail
          ? resend.emails.send({
              from: fromEmail,
              to: adminEmail,
              ...notificationEmail(formType, rest),
            })
          : Promise.resolve(),
      ]);

      for (const result of results) {
        if (result.status === "rejected") {
          console.error("Failed to send submission email:", result.reason);
        }
      }
    }

    return { ok: true };
  });

/** Dashboard-only: list/filter the submissions inbox. */
export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  });

/** Dashboard-only: mark a submission read/archived. */
export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string(), status: z.enum(["new", "read", "archived"]) }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("form_submissions")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Dashboard-only: delete a submission. */
export const deleteSubmission = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("form_submissions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Dashboard-only: correct an application's details (and optionally its
 * status). Only the applicant-facing fields can change — which opportunity it
 * belongs to stays fixed, so messaging-by-opportunity keeps working.
 */
export const updateOpportunityApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      status: z.enum(["new", "read", "archived"]),
      data: z.object({
        fullName: z.string().trim().min(1),
        email: z.string().trim().email(),
        phone: z.string().trim().min(1),
        state: z.string().optional().or(z.literal("")),
        cvLink: z.string().trim().url().optional().or(z.literal("")),
        message: z.string().optional().or(z.literal("")),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: readError } = await supabase
      .from("form_submissions")
      .select("data,form_type")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!existing || existing.form_type !== "opportunity") throw new Error("Application not found.");

    const { error } = await supabase
      .from("form_submissions")
      .update({ data: { ...(existing.data as object), ...data.data, email: data.data.email.toLowerCase() }, status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
