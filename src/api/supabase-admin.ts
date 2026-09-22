import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client, for server-only code.
 *
 * Cloudflare Workers inject env per-request, so this must be constructed
 * inside a handler (never at module scope) — see start-core/execution-model.
 * Bypasses RLS entirely; every table has RLS enabled with no policies, so
 * this is the only thing that can read or write them.
 */
export function getSupabaseAdmin(): SupabaseClient {
  // VITE_SUPABASE_URL isn't a secret (it's just the project URL, also used
  // client-side for the dashboard's auth client) — reusing it here avoids a
  // duplicate env var. The service role key is the only real secret.
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Returns null instead of throwing when Supabase isn't configured yet, so
 * public pages can render an empty state before the user finishes setup
 * instead of crashing the whole route.
 */
export function tryGetSupabaseAdmin(): SupabaseClient | null {
  try {
    return getSupabaseAdmin();
  } catch {
    return null;
  }
}
