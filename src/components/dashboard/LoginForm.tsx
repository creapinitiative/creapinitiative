import { useState } from "react";
import logo from "@/assets/creap-logo-primary.png";

export function LoginForm({
  configured,
  onSignIn,
}: {
  configured: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-g50 px-6">
      <div className="w-full max-w-sm bg-white border border-rule rounded-sm p-8">
        <img src={logo} alt="CREAP Africa Initiative" className="h-10 w-auto mb-6" />
        <h1 className="font-display text-2xl text-ink mb-1">Dashboard sign in</h1>
        <p className="text-sm text-ink3 mb-6">Admin access only.</p>

        {!configured ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm p-3">
            Supabase isn't configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-ink2 mb-1.5">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink2 mb-1.5">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-rule rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-g600 hover:bg-g700 disabled:opacity-60 text-white text-sm font-semibold uppercase tracking-wide py-3 rounded-sm transition"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
