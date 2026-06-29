import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/creap-logo-light.png.asset.json";
import logoDark from "@/assets/creap-logo.png.asset.json";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Resources", to: "/resources" },
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
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10 h-[78px]">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={onLight ? logoDark.url : logo.url}
            alt="CREAP Africa Initiative"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
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
          ))}
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
              <Link
                key={item.to}
                to={item.to}
                className="text-white/85 hover:text-white py-2.5 text-sm tracking-wide"
              >
                {item.label}
              </Link>
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
