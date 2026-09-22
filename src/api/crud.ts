import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin, tryGetSupabaseAdmin } from "@/api/supabase-admin";

/**
 * One generic CRUD factory reused by all six CMS collections, instead of
 * hand-writing ~24 near-identical server functions. `list` is public (the
 * public site reads through it); create/update/remove all require a valid
 * admin session via `authMiddleware`.
 */
export function createCrudServerFns<Schema extends z.ZodTypeAny>(
  table: string,
  schema: Schema,
  orderBy: { column: string; ascending: boolean } = { column: "sort_order", ascending: true },
) {
  const list = createServerFn({ method: "GET" }).handler(async () => {
    const supabase = tryGetSupabaseAdmin();
    if (!supabase) return [] as Array<z.infer<Schema> & { id: string; sort_order: number }>;

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending })
      .order("created_at", { ascending: false });

    console.error(`[DEBUG list] table=${table} rowCount=${data?.length} error=${error?.message ?? "none"}`);

    if (error) throw new Error(error.message);
    return data as Array<z.infer<Schema> & { id: string; sort_order: number }>;
  });

  const create = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((input: unknown) => schema.parse(input) as z.infer<Schema>)
    .handler(async ({ data }) => {
      const supabase = getSupabaseAdmin();

      const { data: maxRow } = await supabase
        .from(table)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextSortOrder = ((maxRow?.sort_order as number | undefined) ?? -1) + 1;

      const { data: row, error } = await supabase
        .from(table)
        .insert({ ...data, sort_order: nextSortOrder })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return row;
    });

  const update = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((input: unknown) => {
      const parsed = input as { id: string; data: z.infer<Schema> };
      if (!parsed?.id) throw new Error("Missing id");
      return { id: parsed.id, data: schema.parse(parsed.data) };
    })
    .handler(async ({ data: { id, data } }) => {
      const supabase = getSupabaseAdmin();
      const { data: row, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return row;
    });

  const remove = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((input: unknown) => {
      const parsed = input as { id: string };
      if (!parsed?.id) throw new Error("Missing id");
      return { id: parsed.id };
    })
    .handler(async ({ data: { id } }) => {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return { ok: true };
    });

  return { list, create, update, remove };
}
