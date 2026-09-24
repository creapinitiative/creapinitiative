import { Link } from "@tanstack/react-router";
import { Email } from "@/components/site/Email";
import logo from "@/assets/creap-logo-alt-small.png";
import { Reveal } from "@/components/site/Reveal";
import { useFormSubmit } from "@/lib/use-form-submit";
import { Facebook, Linkedin, Instagram, Twitter, Youtube, Mail, MapPin, AlertCircle } from "lucide-react";
import { TikTokIcon, ThreadsIcon } from "@/components/site/SocialIcons";

export function SiteFooter() {
  const { status, error, handleSubmit } = useFormSubmit("You're subscribed — welcome aboard!");

  return (
    <footer className="bg-g900 text-white/75">
      {/* Newsletter band */}
      <section className="bg-g700">
        <Reveal as="div" y={20} className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12 lg:px-28 py-20 grid lg:grid-cols-2 gap-12 items-center">
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
            onSubmit={(e) =>
              handleSubmit(e, (fd) => ({
                formType: "newsletter",
                firstName: fd.get("firstName"),
                lastName: fd.get("lastName"),
                email: fd.get("email"),
              }))
            }
            className="grid sm:grid-cols-2 gap-4"
          >
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              className="bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last name"
              className="bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="sm:col-span-2 bg-white/5 border border-white/15 rounded-sm px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold transition"
              required
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="sm:col-span-2 bg-gold hover:bg-gold2 disabled:opacity-60 text-g900 font-semibold uppercase tracking-wider text-xs py-4 rounded-sm transition hover:-translate-y-px"
            >
              {status === "submitting" ? "Subscribing…" : "Subscribe to Community Pulse"}
            </button>
            {status === "error" ? (
              <p className="sm:col-span-2 flex items-center gap-2 text-red-300 text-[11px] tracking-wide">
                <AlertCircle size={14} /> {error}
              </p>
            ) : (
              <p className="sm:col-span-2 text-[11px] text-white/40 tracking-wide">
                We respect your privacy. Unsubscribe at any time.
              </p>
            )}
          </form>
        </Reveal>
      </section>

      {/* Main footer */}
      <Reveal as="div" y={20} className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 py-20 grid lg:grid-cols-5 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          <img src={logo} alt="CREAP" className="h-12 w-auto mb-6" />
          <p className="max-w-md text-sm text-white/65 leading-relaxed">
            Community Rights Education Advancement Pathway Initiative - a nonprofit empowering marginalized communities through people-centered, rights-based, and sustainable development solutions.
          </p>
          <p className="mt-3 text-sm text-white/60">Abuja, Nigeria.</p>
          <div className="flex items-center gap-3 mt-6">
            {[
              { Icon: Facebook, href: "https://www.facebook.com/share/16BhHZR317/" },
              { Icon: Instagram, href: "https://www.instagram.com/creapafricainitiative" },
              { Icon: Linkedin, href: "https://www.linkedin.com/company/creap-africa-initiative/" },
              { Icon: Twitter, href: "https://x.com/creapafrica" },
              { Icon: TikTokIcon, href: "https://vt.tiktok.com/ZS4HjMs5W/" },
              { Icon: ThreadsIcon, href: "https://www.threads.com/@creapafricainitiative" },
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
          <p className="eyebrow text-gold3 mb-5">Organisation</p>
          <ul className="space-y-3 text-sm">
            {[
              ["About", "/about"],
              ["Programs", "/programs"],
              ["Knowledge Hub", "/resources"],
              ["Reports", "/reports"],
              ["Leadership", "/leadership"],
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
            <li><Link to="/get-involved" className="text-white/65 hover:text-gold3">Get Involved</Link></li>
            <li><Link to="/get-involved" className="text-white/65 hover:text-gold3">Partner with Us</Link></li>
            <li><Link to="/donate" className="text-white/65 hover:text-gold3">Donate</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold3 mb-5">Contact</p>
          <div className="space-y-3 text-sm text-white/60 lg:mt-0">
            <p>+234 8057193855</p>
            <p>+234 7067926823</p>
            <p className="flex items-start gap-2"><Mail size={14} className="mt-1 text-gold3" /> <Email address="contact@creapinitiative.org" /></p>
            <p className="flex items-start gap-2"><Mail size={14} className="mt-1 text-gold3" /> <Email address="partnership@creapinitiative.org" /></p>
            <p className="flex items-start gap-2"><MapPin size={14} className="mt-1 text-gold3" /> 8, Ebighi Anwang Road, Uquo, Esit Eket LGA, Akwa Ibom State</p>
            <p className="flex items-start gap-2"><MapPin size={14} className="mt-1 text-gold3" /> 9 Yola Street, Garki Area 7 Abuja, Federal Capital Territory, Nigeria</p>
          </div>
        </div>
      </Reveal>

      <div className="border-t border-white/8">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} CREAP Africa Initiative. All rights reserved.</p>
          <p>Registered under the Companies and Allied Matters Act, 2020.</p>
        </div>
      </div>
    </footer>
  );
}
