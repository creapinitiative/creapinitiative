import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase-client";

/**
 * Client-side only. Tracks the dashboard's Supabase Auth session and exposes
 * sign-in/out. This is UX state — the real security boundary is
 * `authMiddleware` verifying the token server-side on every mutation.
 */
export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let supabase;
    try {
      supabase = getBrowserSupabase();
    } catch {
      setConfigured(false);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const supabase = getBrowserSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }

  async function signOut() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
  }

  return { session, loading, configured, signIn, signOut };
}
