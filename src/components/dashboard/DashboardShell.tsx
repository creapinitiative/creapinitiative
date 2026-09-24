import { type ReactNode, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Inbox,
  Send,
  FileText,
  BookOpen,
  BookOpenCheck,
  Megaphone,
  Newspaper,
  CalendarDays,
  Images,
  Users2,
  HandCoins,
  GalleryHorizontal,
  Briefcase,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "@/assets/creap-logo-alt-small.png";
import { useAdminAuth } from "@/lib/use-admin-auth";
import { LoginForm } from "@/components/dashboard/LoginForm";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/submissions", label: "Submissions", icon: Inbox },
  { to: "/dashboard/donations", label: "Donations", icon: HandCoins },
  { to: "/dashboard/messaging", label: "Messaging", icon: Send },
  { to: "/dashboard/hero-slides", label: "Homepage Slides", icon: GalleryHorizontal },
  { to: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
  { to: "/dashboard/policy-briefs", label: "Policy Briefs", icon: FileText },
  { to: "/dashboard/toolkits-guides", label: "Toolkits & Guides", icon: BookOpenCheck },
  { to: "/dashboard/press-statements", label: "Press Statements", icon: Megaphone },
  { to: "/dashboard/reports", label: "Reports", icon: BookOpen },
  { to: "/dashboard/blogs", label: "Blogs", icon: Newspaper },
  { to: "/dashboard/programs", label: "Upcoming Programs", icon: CalendarDays },
  { to: "/dashboard/gallery", label: "Gallery", icon: Images },
  { to: "/dashboard/leadership", label: "Leadership", icon: Users2 },
] as const;

function SidebarContent({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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

function BottomNav() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-g900 border-t border-white/10">
      <div className="relative flex items-center">
        <button
          onClick={() => scrollBy(-160)}
          className="shrink-0 h-14 w-8 grid place-items-center text-white/70 hover:text-white bg-g900 relative z-10"
          aria-label="Scroll menu left" title="Scroll menu left"
        >
          <ChevronLeft size={16} />
        </button>

        <div ref={scrollerRef} className="no-scrollbar flex-1 flex items-stretch overflow-x-auto scroll-smooth">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item && item.exact }}
              className="flex flex-col items-center justify-center gap-1 shrink-0 w-16 h-14 text-white/60 hover:text-white transition"
              activeProps={{ className: "!text-gold" }}
            >
              <item.icon size={17} />
              <span className="text-[9px] leading-none text-center px-0.5 truncate w-full">{item.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scrollBy(160)}
          className="shrink-0 h-14 w-8 grid place-items-center text-white/70 hover:text-white bg-g900 relative z-10"
          aria-label="Scroll menu right" title="Scroll menu right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

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
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-g900 text-white flex-col">
        <div className="h-[72px] flex items-center px-6 border-b border-white/10 shrink-0">
          <img src={logo} alt="CREAP Africa Initiative" className="h-8 w-auto" />
        </div>
        <SidebarContent onSignOut={() => void signOut()} />
      </aside>

      {/* Mobile/tablet bottom icon bar */}
      <BottomNav />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[64px] lg:h-[72px] shrink-0 bg-g900 lg:bg-white border-b border-white/10 lg:border-rule flex items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-8">
          <img src={logo} alt="CREAP Africa Initiative" className="h-7 w-auto lg:hidden" />
          <p className="text-xs sm:text-sm text-white/85 lg:text-ink3 truncate">{session.user.email}</p>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}
