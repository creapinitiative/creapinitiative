import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/creap-logo-alt-small.png";
import logoDark from "@/assets/creap-logo-primary.png";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Programs",
    to: "/programs/our-key-programs",
    children: [
      { label: "Our Key Programs", to: "/programs/our-key-programs" },
      { label: "Community Dialogue Programs", to: "/programs/community-dialogue-programs" },
      { label: "Special Programs", to: "/programs/special-programs" },
      { label: "Upcoming Programs", to: "/programs/upcoming-programs" },
    ],
  },
  {
    label: "Resources",
    to: "/resources/policy-briefs",
    children: [
      { label: "Policy Briefs", to: "/resources/policy-briefs" },
      { label: "Gallery", to: "/resources/gallery" },
      { label: "Blogs", to: "/resources/blogs" },
    ],
  },
  { label: "Leadership", to: "/leadership" },
  { label: "Get Involved", to: "/get-involved" },
  { label: "Opportunities", to: "/opportunities" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const isHome = location.pathname === "/";
  const lightBg = !isHome; // interior pages = light header always
  const activePath = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const solid = lightBg || scrolled;
  const onLight = lightBg;

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solid
          ? onLight
            ? "bg-[rgba(250,252,250,0.97)] backdrop-blur-xl shadow-[0_1px_0_var(--rule)]"
            : "bg-[rgba(10,26,15,0.97)] backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-16 lg:px-28 h-[78px]">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={onLight ? logoDark : logo}
            alt="CREAP Africa Initiative"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const parentActive =
              activePath === item.to ||
              Boolean(
                item.children?.some(
                  (child) => activePath === child.to || activePath.startsWith(`${child.to}/`),
                ),
              );

            if (!item.children) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-sm transition-colors",
                    onLight
                      ? "text-ink3 hover:text-ink hover:bg-g100"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                  ].join(" ")}
                  activeProps={{
                    className: onLight
                      ? "text-g700 bg-g100"
                      : "text-white bg-white/10",
                  }}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label} className="relative group">
                <Link
                  to={item.to}
                  className={[
                    "px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-sm transition-colors inline-flex items-center gap-1",
                    onLight
                      ? "text-ink3 hover:text-ink hover:bg-g100"
                      : "text-white/80 hover:text-white hover:bg-white/10",
                    parentActive
                      ? onLight
                        ? "text-g700 bg-g100"
                        : "text-white bg-white/10"
                      : "",
                  ].join(" ")}
                >
                  {item.label}
                  <ChevronDown size={14} className="opacity-70" />
                </Link>

                <div
                  className={[
                    "pointer-events-none absolute left-0 top-full pt-2 opacity-0 translate-y-1 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0",
                  ].join(" ")}
                >
                  <div className="w-72 rounded-sm border border-rule bg-white shadow-[0_20px_35px_rgba(10,26,15,0.12)] p-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className={[
                          "block rounded-sm px-3 py-2.5 text-[13px] transition",
                          activePath === child.to || activePath.startsWith(`${child.to}/`)
                            ? "bg-g100 text-g700"
                            : "text-ink3 hover:bg-g50 hover:text-ink",
                        ].join(" ")}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            to="/get-involved"
            className={[
              "text-[12px] font-medium tracking-wider uppercase px-4 py-2 rounded-sm border transition",
              onLight
                ? "border-rule text-ink3 hover:border-g500 hover:text-ink"
                : "border-white/25 text-white/85 hover:border-white/60 hover:text-white",
            ].join(" ")}
          >
            Join Us
          </Link>
          <Link
            to="/donate"
            className="text-[12px] font-semibold tracking-wider uppercase px-5 py-2.5 rounded-sm bg-gold text-g900 hover:bg-gold2 hover:-translate-y-px transition shadow-[0_4px_12px_rgba(184,148,31,0.25)]"
          >
            Donate
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className={["lg:hidden p-2 rounded-sm", onLight ? "text-ink" : "text-white"].join(" ")}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-g900 border-t border-white/10 px-6 py-4">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.to}
                  className="text-white/85 hover:text-white py-2.5 text-sm tracking-wide block"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 border-l border-white/10 pl-3 mt-1 mb-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="text-white/65 hover:text-white py-1.5 text-xs tracking-wide block"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-4 border-t border-white/10 mt-3">
              <Link to="/get-involved" className="flex-1 text-center text-[12px] uppercase tracking-wider py-2.5 border border-white/25 text-white rounded-sm">
                Join Us
              </Link>
              <Link to="/donate" className="flex-1 text-center text-[12px] uppercase tracking-wider py-2.5 bg-gold text-g900 font-semibold rounded-sm">
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
