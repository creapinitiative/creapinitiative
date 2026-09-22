import { type ReactNode, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  BookOpen,
  BookOpenCheck,
  Megaphone,
  Newspaper,
  CalendarDays,
  Images,
  Users2,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/creap-logo-alt-small.png";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { LoginForm } from "@/components/dashboard/LoginForm";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/submissions", label: "Submissions", icon: Inbox },
  { to: "/dashboard/policy-briefs", label: "Policy Briefs", icon: FileText },
  { to: "/dashboard/toolkits-guides", label: "Toolkits & Guides", icon: BookOpenCheck },
  { to: "/dashboard/press-statements", label: "Press Statements", icon: Megaphone },
  { to: "/dashboard/reports", label: "Reports", icon: BookOpen },
  { to: "/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { to: "/dashboard/programs", label: "Upcoming Programs", icon: CalendarDays },
  { to: "/dashboard/gallery", label: "Gallery", icon: Images },
  { to: "/dashboard/leadership", label: "Leadership", icon: Users2 },
] as const;

function SidebarContent({ onNavigate, onSignOut }: { onNavigate?: () => void; onSignOut: () => void }) {
  return (
    <>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: "exact" in item && item.exact }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
            activeProps={{ className: "!bg-white/10 !text-white" }}
          >
            <item.icon size={16} /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          <ExternalLink size={16} /> View site
        </a>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { session, loading, configured, signIn, signOut } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-g50 text-ink3">Loading…</div>;
  }

  if (!session) {
    return <LoginForm configured={configured} onSignIn={signIn} />;
  }

  return (
    <div className="min-h-screen flex bg-g50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-g900 text-white flex-col">
        <div className="h-[72px] flex items-center px-6 border-b border-white/10 shrink-0">
          <img src={logo} alt="CREAP Africa Initiative" className="h-8 w-auto" />
        </div>
        <SidebarContent onSignOut={() => void signOut()} />
      </aside>

      {/* Mobile off-canvas sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[80vw] bg-g900 text-white flex flex-col h-full">
            <div className="h-[64px] flex items-center justify-between px-5 border-b border-white/10 shrink-0">
              <img src={logo} alt="CREAP Africa Initiative" className="h-7 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-white/80 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} onSignOut={() => void signOut()} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[64px] lg:h-[72px] shrink-0 bg-white border-b border-rule flex items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-8 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-ink2"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <p className="text-xs sm:text-sm text-ink3 truncate">{session.user.email}</p>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
