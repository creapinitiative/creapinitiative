import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Briefcase, GraduationCap, Users2 } from "lucide-react";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Careers, Internships & Fellowships | CREAP" },
      { name: "description", content: "Open roles, internships, fellowships and volunteer calls at CREAP Africa Initiative." },
    ],
  }),
  component: Opportunities,
});

const OPENINGS = [
  { icon: Briefcase, type: "Full-time", title: "Programs Officer — Civic Education", location: "Abuja, Nigeria", deadline: "Rolling" },
  { icon: GraduationCap, type: "Fellowship", title: "Research Fellow — Climate Policy", location: "Remote / Nigeria", deadline: "May 30, 2026" },
  { icon: Users2, type: "Internship", title: "Communications Intern", location: "Hybrid · Abuja", deadline: "Open" },
];

function Opportunities() {
  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title={<>Build your career on <em className="italic text-goldf">purpose</em></>}
        body="Join a team committed to dignified work, rigorous standards, and meaningful change."
      />

      <section className="py-24 bg-bg">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 space-y-4">
          {OPENINGS.map(({ icon: Icon, type, title, location, deadline }) => (
            <article key={title} className="bg-white border border-rule rounded-sm p-7 lg:p-8 grid md:grid-cols-12 gap-6 items-center hover:border-gold transition">
              <div className="md:col-span-1"><Icon size={28} strokeWidth={1.5} className="text-gold" /></div>
              <div className="md:col-span-7">
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-gold">{type}</span>
                <h3 className="font-display text-2xl mt-1">{title}</h3>
                <p className="text-sm text-ink3 mt-1">{location} · Apply by {deadline}</p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Link to="/contact" className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white uppercase tracking-wider text-xs font-semibold px-6 py-3 rounded-sm transition">
                  Apply
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
