import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { getSupabaseAdmin } from "@/api/supabase-admin";

/**
 * Server-function middleware protecting every dashboard mutation.
 *
 * Client half: reads the current Supabase session's access token from the
 * browser (guarded for SSR — Supabase's client-side session lives in
 * localStorage, which doesn't exist during SSR) and sends it as a bearer
 * token.
 *
 * Server half: verifies that token against Supabase Auth. This — not the
 * dashboard route's login gate — is the actual security boundary; the route
 * gate is UX only (see start-core/auth-server-primitives).
 */
export const authMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    let accessToken: string | undefined;
    if (typeof window !== "undefined") {
      const { getBrowserSupabase } = await import("@/lib/supabase-client");
      const supabase = getBrowserSupabase();
      const { data } = await supabase.auth.getSession();
      accessToken = data.session?.access_token;
    }
    return next({
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  })
  .server(async ({ next }) => {
    const authHeader = getRequestHeader("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error("Unauthorized");
    }

    return next({ context: { adminUser: data.user } });
  });
