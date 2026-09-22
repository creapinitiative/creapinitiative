import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BookOpen,
  Newspaper,
  CalendarDays,
  Images,
  Users2,
  LogOut,
  ExternalLink,
} from "lucide-react";
import logo from "@/assets/creap-logo-alt-small.png";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { LoginForm } from "@/components/dashboard/LoginForm";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/submissions", label: "Submissions", icon: Inbox },
  { to: "/dashboard/policy-briefs", label: "Policy Briefs", icon: FileText },
  { to: "/dashboard/reports", label: "Reports", icon: BookOpen },
  { to: "/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { to: "/dashboard/programs", label: "Upcoming Programs", icon: CalendarDays },
  { to: "/dashboard/gallery", label: "Gallery", icon: Images },
  { to: "/dashboard/leadership", label: "Leadership", icon: Users2 },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const { session, loading, configured, signIn, signOut } = useAdminAuth();

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-g50 text-ink3">Loading…</div>;
  }

  if (!session) {
    return <LoginForm configured={configured} onSignIn={signIn} />;
  }

  return (
    <div className="min-h-screen flex bg-g50">
      <aside className="w-64 shrink-0 bg-g900 text-white flex flex-col">
        <div className="h-[72px] flex items-center px-6 border-b border-white/10">
          <img src={logo} alt="CREAP Africa Initiative" className="h-8 w-auto" />
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item && item.exact }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
              activeProps={{ className: "!bg-white/10 !text-white" }}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            <ExternalLink size={16} /> View site
          </a>
          <button
            onClick={() => void signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[72px] shrink-0 bg-white border-b border-rule flex items-center justify-end px-8">
          <p className="text-sm text-ink3">{session.user.email}</p>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
