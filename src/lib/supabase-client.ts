import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-only Supabase client, used exclusively for the dashboard's login
 * session (Supabase Auth). Never used for data reads/writes — those all go
 * through server functions using the service-role key. The anon key is safe
 * to expose client-side by design; it's meaningless without RLS policies,
 * and this project intentionally has none (every table denies anon access).
 */
let client: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
  if (client) return client;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  client = createClient(url, anonKey);
  return client;
}
