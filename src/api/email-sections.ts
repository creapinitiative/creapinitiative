import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin } from "@/api/supabase-admin";

/**
 * "Saved sections" in the Messaging page's email builder: a named, reusable
 * chunk of blocks (e.g. a standard footer, a recurring call-to-action) an
 * admin can insert into any future email instead of rebuilding it each
 * time. Block content is free-form JSON (see src/lib/email-blocks.ts) —
 * this file only stores and returns it, it never needs to understand its
 * shape. Dashboard-only end to end: there's no public use for this table.
 */

// Plain JSON, not `unknown` — TanStack Start's server functions verify at the
// type level that whatever they return can actually be serialized over the
// wire, and `unknown` can't prove that even though it works fine at runtime.
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const emailSectionSchema = z.object({
  name: z.string().trim().min(1, "Please name this section"),
  blocks: z.array(z.record(z.string(), z.custom<Json>())).min(1, "Nothing to save — add a block first"),
});

export type EmailSection = { id: string; name: string; blocks: Record<string, Json>[]; created_at: string };

export const listEmailSections = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("email_sections").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as EmailSection[];
  });

export const createEmailSection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => emailSectionSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase.from("email_sections").insert(data).select().single();
    if (error) throw new Error(error.message);
    return row as EmailSection;
  });

export const removeEmailSection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("email_sections").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
