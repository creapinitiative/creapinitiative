import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/api/auth-middleware";
import { getSupabaseAdmin, tryGetSupabaseAdmin } from "@/api/supabase-admin";
import {
  policyBriefSchema,
  reportSchema,
  blogPostSchema,
  upcomingProgramSchema,
  galleryImageSchema,
  leadershipSchema,
  toolkitGuideSchema,
  pressStatementSchema,
  type PolicyBrief,
  type Report,
  type BlogPost,
  type UpcomingProgramRow,
  type GalleryImage,
  type LeadershipEntry,
  type ToolkitGuide,
  type PressStatement,
} from "@/api/collections";

/**
 * Every server function below is declared as its own top-level
 * `createServerFn(...).handler(...)` call — NOT produced by a shared
 * factory function. TanStack Start's build-time transform splits
 * client/server code by statically finding each `.handler()` call site; a
 * factory that returns `createServerFn(...).handler(fn)` from inside a
 * reusable function body only has ONE such call site in the source, shared
 * across every instance the factory produces. That single call site can't
 * be resolved to the right runtime closure, and calling any of those
 * functions silently resolves to `undefined` instead of running the real
 * handler or throwing — confirmed by direct production debugging (a raw
 * Supabase query returned real rows while the factory-produced equivalent
 * returned `undefined` in the exact same request). Keep every collection's
 * list/create/update/remove written out explicitly, even though it's more
 * repetitive than a generic helper.
 */

async function nextSortOrder(table: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { data: maxRow } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((maxRow?.sort_order as number | undefined) ?? -1) + 1;
}

// ── Policy Briefs ────────────────────────────────────────────────────────

export const listPolicyBriefs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as PolicyBrief[];
  const { data, error } = await supabase
    .from("policy_briefs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as PolicyBrief[];
});

export const createPolicyBrief = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => policyBriefSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("policy_briefs");
    const { data: row, error } = await supabase.from("policy_briefs").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updatePolicyBrief = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: policyBriefSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("policy_briefs")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removePolicyBrief = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("policy_briefs").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const policyBriefsApi = { list: listPolicyBriefs, create: createPolicyBrief, update: updatePolicyBrief, remove: removePolicyBrief };

// ── Reports ──────────────────────────────────────────────────────────────

export const listReports = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as Report[];
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Report[];
});

export const createReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => reportSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("reports");
    const { data: row, error } = await supabase.from("reports").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: reportSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("reports")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeReport = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reportsApi = { list: listReports, create: createReport, update: updateReport, remove: removeReport };

/** Public pages need only one report category at a time, not the full table. */
export const listReportsByCategory = createServerFn({ method: "GET" })
  .validator(z.object({ category: z.enum(["project", "annual", "financial"]) }))
  .handler(async ({ data }) => {
    const supabase = tryGetSupabaseAdmin();
    if (!supabase) return [] as Report[];

    const { data: rows, error } = await supabase
      .from("reports")
      .select("*")
      .eq("category", data.category)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return rows as Report[];
  });

// ── Blog Posts ───────────────────────────────────────────────────────────

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as BlogPost[];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as BlogPost[];
});

export const createBlogPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => blogPostSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("blog_posts");
    const { data: row, error } = await supabase.from("blog_posts").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateBlogPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: blogPostSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeBlogPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const blogPostsApi = { list: listBlogPosts, create: createBlogPost, update: updateBlogPost, remove: removeBlogPost };

/** The blog detail page (`$slug`) needs a single row, not the list. */
export const getBlogPostBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const supabase = tryGetSupabaseAdmin();
    if (!supabase) return null;

    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return row;
  });

// ── Upcoming Programs ────────────────────────────────────────────────────

export const listUpcomingPrograms = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as UpcomingProgramRow[];
  const { data, error } = await supabase
    .from("upcoming_programs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as UpcomingProgramRow[];
});

export const createUpcomingProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => upcomingProgramSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("upcoming_programs");
    const { data: row, error } = await supabase.from("upcoming_programs").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateUpcomingProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: upcomingProgramSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("upcoming_programs")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeUpcomingProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("upcoming_programs").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const upcomingProgramsApi = {
  list: listUpcomingPrograms,
  create: createUpcomingProgram,
  update: updateUpcomingProgram,
  remove: removeUpcomingProgram,
};

/** The upcoming-program detail page (`$slug`) needs a single row, not the list. */
export const getUpcomingProgramBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const supabase = tryGetSupabaseAdmin();
    if (!supabase) return null;

    const { data: row, error } = await supabase
      .from("upcoming_programs")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return row;
  });

// ── Gallery Images ───────────────────────────────────────────────────────

export const listGalleryImages = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as GalleryImage[];
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as GalleryImage[];
});

export const createGalleryImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => galleryImageSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("gallery_images");
    const { data: row, error } = await supabase.from("gallery_images").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateGalleryImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: galleryImageSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("gallery_images")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeGalleryImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const galleryImagesApi = {
  list: listGalleryImages,
  create: createGalleryImage,
  update: updateGalleryImage,
  remove: removeGalleryImage,
};

// ── Leadership ───────────────────────────────────────────────────────────

export const listLeadership = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as LeadershipEntry[];
  const { data, error } = await supabase
    .from("leadership")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as LeadershipEntry[];
});

export const createLeadershipEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => leadershipSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("leadership");
    const { data: row, error } = await supabase.from("leadership").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateLeadershipEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: leadershipSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("leadership")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeLeadershipEntry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leadership").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const leadershipApi = {
  list: listLeadership,
  create: createLeadershipEntry,
  update: updateLeadershipEntry,
  remove: removeLeadershipEntry,
};

// ── Toolkits & Guides ────────────────────────────────────────────────────

export const listToolkitsGuides = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as ToolkitGuide[];
  const { data, error } = await supabase
    .from("toolkits_guides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as ToolkitGuide[];
});

export const createToolkitGuide = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => toolkitGuideSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("toolkits_guides");
    const { data: row, error } = await supabase.from("toolkits_guides").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateToolkitGuide = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: toolkitGuideSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("toolkits_guides")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removeToolkitGuide = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("toolkits_guides").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const toolkitsGuidesApi = {
  list: listToolkitsGuides,
  create: createToolkitGuide,
  update: updateToolkitGuide,
  remove: removeToolkitGuide,
};

// ── Press Statements ─────────────────────────────────────────────────────

export const listPressStatements = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = tryGetSupabaseAdmin();
  if (!supabase) return [] as PressStatement[];
  const { data, error } = await supabase
    .from("press_statements")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as PressStatement[];
});

export const createPressStatement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => pressStatementSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getSupabaseAdmin();
    const sort_order = await nextSortOrder("press_statements");
    const { data: row, error } = await supabase.from("press_statements").insert({ ...data, sort_order }).select().single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updatePressStatement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string; data: unknown };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id, data: pressStatementSchema.parse(parsed.data) };
  })
  .handler(async ({ data: { id, data } }) => {
    const supabase = getSupabaseAdmin();
    const { data: row, error } = await supabase
      .from("press_statements")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const removePressStatement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const parsed = input as { id: string };
    if (!parsed?.id) throw new Error("Missing id");
    return { id: parsed.id };
  })
  .handler(async ({ data: { id } }) => {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("press_statements").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const pressStatementsApi = {
  list: listPressStatements,
  create: createPressStatement,
  update: updatePressStatement,
  remove: removePressStatement,
};
