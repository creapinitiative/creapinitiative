import { createFileRoute } from "@tanstack/react-router";
import { policyBriefsApi, blogPostsApi, galleryImagesApi, listReportsByCategory } from "@/api/collections-api";
import { tryGetSupabaseAdmin } from "@/api/supabase-admin";

export const Route = createFileRoute("/debug-check")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = tryGetSupabaseAdmin();
        const out: Record<string, unknown> = {
          supabaseConfigured: !!supabase,
          envUrlPresent: !!process.env.VITE_SUPABASE_URL,
          envServiceKeyPresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        };

        try {
          out.policyBriefs = await policyBriefsApi.list();
        } catch (e) {
          out.policyBriefsError = e instanceof Error ? e.message : String(e);
        }

        try {
          out.gallery = (await galleryImagesApi.list()).length;
        } catch (e) {
          out.galleryError = e instanceof Error ? e.message : String(e);
        }

        try {
          out.blogPosts = await blogPostsApi.list();
        } catch (e) {
          out.blogPostsError = e instanceof Error ? e.message : String(e);
        }

        try {
          out.projectReports = await listReportsByCategory({ data: { category: "project" } });
        } catch (e) {
          out.projectReportsError = e instanceof Error ? e.message : String(e);
        }

        if (supabase) {
          try {
            const raw = await supabase.from("policy_briefs").select("*");
            out.rawPolicyBriefsQuery = { count: raw.data?.length, error: raw.error?.message };
          } catch (e) {
            out.rawQueryError = e instanceof Error ? e.message : String(e);
          }
        }

        return Response.json(out);
      },
    },
  },
});
