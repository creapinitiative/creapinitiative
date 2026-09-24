import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin } from "@/api/supabase-admin";
import { tryGetResend } from "@/api/resend-client";
import { wrapper } from "@/api/email-templates";

/**
 * Paystack giving. Flow: the donate page calls `startDonation` (creates a
 * pending row + a Paystack checkout URL) and redirects the browser there.
 * Paystack sends the donor back to /donate?reference=…, which calls
 * `confirmDonation`, and Paystack also POSTs a webhook — both paths end in
 * `settleDonation`, which asks Paystack for the truth and updates the row.
 * Nothing the browser sends can mark a donation successful.
 */

const PAYSTACK_API = "https://api.paystack.co";
const MIN_NAIRA = 100;
const MAX_NAIRA = 50_000_000;

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    console.error("PAYSTACK_SECRET_KEY is not set in this deployment's environment variables.");
    throw new Error("Online giving isn't available right now. Please try again later.");
  }
  return key;
}

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const body = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!res.ok || !body?.status) throw new Error(body?.message || `Paystack request failed (${res.status}).`);
  return body.data as T;
}

const startSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  amountNaira: z.number().finite().min(MIN_NAIRA, `The minimum gift is ₦${MIN_NAIRA}.`).max(MAX_NAIRA),
});

/** Public: create a pending donation and return the Paystack checkout URL. */
export const startDonation = createServerFn({ method: "POST" })
  .validator(startSchema)
  .handler(async ({ data }) => {
    getSecretKey(); // fail before creating a pending row if Paystack isn't configured
    const supabase = getSupabaseAdmin();
    const reference = `CREAP-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
    const amountKobo = Math.round(data.amountNaira * 100);
    const email = data.email.toLowerCase();

    const origin = getRequestHeader("origin") || `https://${getRequestHeader("host")}`;

    const { error } = await supabase.from("donations").insert({
      reference,
      full_name: data.fullName,
      email,
      amount_kobo: amountKobo,
      currency: "NGN",
    });
    if (error) throw new Error(error.message);

    const init = await paystack<{ authorization_url: string }>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: "NGN",
        reference,
        callback_url: `${origin}/donate`,
        metadata: { full_name: data.fullName },
      }),
    });

    return { authorizationUrl: init.authorization_url };
  });

type PaystackTransaction = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
};

/**
 * Ask Paystack for the transaction's real state and record it. Idempotent —
 * the receipt email only goes out on the pending → success transition, so the
 * callback and the webhook can both run without double-sending.
 */
export async function settleDonation(supabase: SupabaseClient, reference: string) {
  const { data: row, error } = await supabase.from("donations").select("*").eq("reference", reference).maybeSingle();
  if (error) throw new Error(error.message);
  if (!row) return null; // not one of ours (e.g. another Paystack product)
  if (row.status === "success") return { status: "success" as const, row };

  const tx = await paystack<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);

  if (tx.status === "success") {
    // Guard against a paid amount that doesn't match what we asked for.
    if (tx.amount !== Number(row.amount_kobo) || tx.currency !== row.currency) {
      console.error(`Paystack amount mismatch for ${reference}`, tx);
      await supabase.from("donations").update({ status: "failed" }).eq("reference", reference);
      return { status: "failed" as const, row };
    }
    const { data: updated } = await supabase
      .from("donations")
      .update({ status: "success", channel: tx.channel ?? null, paid_at: tx.paid_at ?? new Date().toISOString() })
      .eq("reference", reference)
      .neq("status", "success")
      .select()
      .maybeSingle();
    // `updated` is null if another request already settled it first.
    if (updated) await sendReceipts(updated);
    return { status: "success" as const, row: updated ?? row };
  }

  if (tx.status === "failed" || tx.status === "abandoned") {
    await supabase.from("donations").update({ status: "failed" }).eq("reference", reference);
    return { status: "failed" as const, row };
  }

  return { status: "pending" as const, row };
}

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

async function sendReceipts(row: { full_name: string; email: string; amount_kobo: number; reference: string }) {
  const resend = tryGetResend();
  const from = process.env.RESEND_FROM_EMAIL;
  if (!resend || !from) return;

  const amount = formatNaira(Number(row.amount_kobo));
  const name = escapeHtml(row.full_name);
  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: row.email,
      subject: "Thank you for your gift to CREAP Africa Initiative",
      html: wrapper(`
        <p>Hi ${name},</p>
        <p>Thank you — your gift of <strong>${amount}</strong> has been received. It will go directly toward civic education, climate action, health outreaches and youth empowerment.</p>
        <p style="color:#8a8a8a;font-size:13px;">Reference: ${escapeHtml(row.reference)}</p>
        <p style="margin-top:24px;">— The CREAP Africa Initiative team</p>
      `),
    }),
    process.env.ADMIN_NOTIFICATION_EMAIL
      ? resend.emails.send({
          from,
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: `New donation: ${amount} from ${row.full_name}`,
          html: wrapper(`<p><strong>${name}</strong> (${escapeHtml(row.email)}) gave <strong>${amount}</strong>.</p><p style="color:#8a8a8a;font-size:13px;">Reference: ${escapeHtml(row.reference)}</p>`),
        })
      : Promise.resolve(),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("Failed to send donation email:", r.reason);
}

/** Public: called when the donor lands back on /donate?reference=… */
export const confirmDonation = createServerFn({ method: "POST" })
  .validator(z.object({ reference: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const settled = await settleDonation(supabase, data.reference);
    if (!settled) throw new Error("We couldn't find that donation.");
    const { status, row } = settled;
    return { status, amountKobo: Number(row.amount_kobo), fullName: row.full_name as string };
  });

/** Dashboard-only: every donation, newest first. */
export const listDonations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as {
      id: string;
      reference: string;
      full_name: string;
      email: string;
      amount_kobo: number;
      currency: string;
      status: "pending" | "success" | "failed";
      channel: string | null;
      paid_at: string | null;
      created_at: string;
    }[];
  });

/** Verifies Paystack's x-paystack-signature (HMAC-SHA512 of the raw body, keyed with the secret key). */
export async function verifyWebhookSignature(rawBody: string, signature: string | null): Promise<boolean> {
  if (!signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(getSecretKey()), { name: "HMAC", hash: "SHA-512" }, false, ["verify"]);
  const sigBytes = new Uint8Array(signature.match(/../g)?.map((h) => parseInt(h, 16)) ?? []);
  if (sigBytes.length !== 64) return false;
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(rawBody));
}
