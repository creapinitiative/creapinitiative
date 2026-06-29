import { Link } from "@tanstack/react-router";
import logo from "@/assets/creap-logo-light.png.asset.json";
import { Facebook, Linkedin, Instagram, Twitter, Youtube, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-g900 text-white/75">
      {/* Newsletter band */}
      <section className="bg-g700">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-gold3 mb-4">Stay Connected</p>
            <h2 className="display-lg text-white">
              Sign up for our monthly<br/>
              <em className="text-goldf">Community Pulse</em>
            </h2>
            <p className="mt-5 text-white/70 max-w-md">
              Receive updates on our programs, publications, events and impact stories directly in your inbox.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="First name"
              className="bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              className="bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="sm:col-span-2 bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <button
              type="submit"
              className="sm:col-span-2 bg-gold hover:bg-gold2 text-g900 font-semibold uppercase tracking-wider text-xs py-4 rounded-sm transition hover:-translate-y-px"
            >
              Subscribe to Community Pulse
            </button>
            <p className="sm:col-span-2 text-[11px] text-white/40 tracking-wide">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>

      {/* Main footer */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20 grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-2">
          <img src={logo.url} alt="CREAP" className="h-12 w-auto mb-6" />
          <p className="max-w-md text-sm text-white/65 leading-relaxed">
            CREAP Africa Initiative champions innovative platforms, tools, and community-driven approaches that advance bold advocacy, empowerment, and leadership strategies across Nigeria and Africa.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/share/1ESwRFSCuT/" },
              { Icon: Linkedin, href: "https://www.linkedin.com/company/creap-africa-initiative/" },
              { Icon: Instagram, href: "https://www.instagram.com/creapafricainitiative" },
              { Icon: Twitter, href: "https://x.com/creapafrica" },
              { Icon: Youtube, href: "https://youtube.com/@creapafricainitiative" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 grid place-items-center border border-white/15 rounded-sm text-white/70 hover:text-gold3 hover:border-gold transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold3 mb-5">Explore</p>
          <ul className="space-y-3 text-sm">
            {[
              ["About", "/about"],
              ["Programs", "/programs"],
              ["Resources", "/resources"],
              ["Leadership", "/leadership"],
              ["Opportunities", "/opportunities"],
            ].map(([l, t]) => (
              <li key={t}>
                <Link to={t} className="text-white/65 hover:text-gold3 transition">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold3 mb-5">Engage</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/get-involved" className="text-white/65 hover:text-gold3">Volunteer</Link></li>
            <li><Link to="/donate" className="text-white/65 hover:text-gold3">Donate</Link></li>
            <li><Link to="/contact" className="text-white/65 hover:text-gold3">Contact</Link></li>
          </ul>
          <div className="mt-6 space-y-3 text-sm text-white/60">
            <p className="flex items-start gap-2"><Mail size={14} className="mt-1 text-gold3" /> info@creapinitiative.org</p>
            <p className="flex items-start gap-2"><MapPin size={14} className="mt-1 text-gold3" /> Abuja, Nigeria</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} CREAP Africa Initiative. All rights reserved.</p>
          <p>Registered under the Companies and Allied Matters Act, 2020.</p>
        </div>
      </div>
    </footer>
  );
}
