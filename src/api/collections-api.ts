import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createCrudServerFns } from "@/api/crud";
import { tryGetSupabaseAdmin } from "@/api/supabase-admin";
import {
  policyBriefSchema,
  reportSchema,
  blogPostSchema,
  upcomingProgramSchema,
  galleryImageSchema,
  leadershipSchema,
  type Report,
} from "@/api/collections";

export const policyBriefsApi = createCrudServerFns("policy_briefs", policyBriefSchema);
export const reportsApi = createCrudServerFns("reports", reportSchema);
export const blogPostsApi = createCrudServerFns("blog_posts", blogPostSchema);
export const upcomingProgramsApi = createCrudServerFns("upcoming_programs", upcomingProgramSchema);
export const galleryImagesApi = createCrudServerFns("gallery_images", galleryImageSchema, {
  column: "sort_order",
  ascending: true,
});
export const leadershipApi = createCrudServerFns("leadership", leadershipSchema);

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
