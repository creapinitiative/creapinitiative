import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, Send, FileText, BookOpen, BookOpenCheck, Megaphone, Newspaper, CalendarDays, Images, Users2, HandCoins, GalleryHorizontal, HandHeart } from "lucide-react";
import { listSubmissions } from "@/api/submissions";
import { listDonations } from "@/api/paystack";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

type Submission = { id: string; form_type: string; data: Record<string, unknown>; status: string; created_at: string };

const QUICK_LINKS = [
  { to: "/dashboard/donations", label: "Donations", icon: HandCoins },
  { to: "/dashboard/messaging", label: "Messaging", icon: Send },
  { to: "/dashboard/hero-slides", label: "Homepage Slides", icon: GalleryHorizontal },
  { to: "/dashboard/get-involved", label: "Get Involved", icon: HandHeart },
  { to: "/dashboard/policy-briefs", label: "Policy Briefs", icon: FileText },
  { to: "/dashboard/toolkits-guides", label: "Toolkits & Guides", icon: BookOpenCheck },
  { to: "/dashboard/press-statements", label: "Press Statements", icon: Megaphone },
  { to: "/dashboard/reports", label: "Reports", icon: BookOpen },
  { to: "/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { to: "/dashboard/programs", label: "Upcoming Programs", icon: CalendarDays },
  { to: "/dashboard/gallery", label: "Gallery", icon: Images },
  { to: "/dashboard/leadership", label: "Leadership", icon: Users2 },
] as const;

export function DashboardOverview() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [donations, setDonations] = useState<{ amount_kobo: number; status: string }[] | null>(null);

  useEffect(() => {
    listDonations()
      .then((rows) => setDonations(rows))
      .catch(() => setDonations([]));
  }, []);

  useEffect(() => {
    listSubmissions()
      .then((rows) => setSubmissions(rows as Submission[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load submissions."));
  }, []);

  const newCount = submissions?.filter((s) => s.status === "new").length ?? 0;
  const recent = submissions?.slice(0, 5) ?? [];
  const paid = donations?.filter((d) => d.status === "success") ?? [];
  const totalRaised = paid.reduce((sum, d) => sum + Number(d.amount_kobo), 0) / 100;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-1">Overview</h1>
      <p className="text-ink3 mb-8">A snapshot of activity across the site.</p>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <Link
          to="/dashboard/submissions"
          className="bg-white border border-rule hover:border-gold rounded-sm p-6 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-sm bg-g100 text-g600 grid place-items-center"><Inbox size={18} /></div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ink3">Submissions</p>
          </div>
          <p className="font-display text-4xl text-ink">{submissions?.length ?? "—"}</p>
          <p className="text-sm text-ink3 mt-1">{newCount} unread</p>
        </Link>
        <Link
          to="/dashboard/donations"
          className="bg-white border border-rule hover:border-gold rounded-sm p-6 transition"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-sm bg-g100 text-g600 grid place-items-center"><HandCoins size={18} /></div>
            <p className="text-sm font-semibold uppercase tracking-wide text-ink3">Donations</p>
          </div>
          <p className="font-display text-4xl text-ink">{donations ? `₦${totalRaised.toLocaleString("en-NG")}` : "—"}</p>
          <p className="text-sm text-ink3 mt-1">{paid.length} successful gift{paid.length === 1 ? "" : "s"}</p>
        </Link>
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Manage content</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-3 bg-white border border-rule hover:border-gold rounded-sm p-4 transition"
          >
            <div className="w-9 h-9 rounded-sm bg-g100 text-g600 grid place-items-center shrink-0"><link.icon size={16} /></div>
            <span className="text-sm font-medium text-ink">{link.label}</span>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-xl text-ink mb-4">Recent submissions</h2>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="bg-white border border-rule rounded-sm divide-y divide-rule">
        {submissions === null && !error && <p className="text-ink3 text-center py-10">Loading…</p>}
        {submissions !== null && recent.length === 0 && (
          <p className="text-ink3 text-center py-10">No submissions yet.</p>
        )}
        {recent.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-g600">{s.form_type.replace("_", " ")}</p>
              <p className="text-ink3 text-sm truncate">
                {(s.data.name as string) || (s.data.fullName as string) || (s.data.email as string) || "—"}
              </p>
            </div>
            <p className="text-xs text-ink4 shrink-0">{new Date(s.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
