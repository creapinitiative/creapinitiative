import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Leaf, Scale, Users, Heart, BookOpen, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs & Initiatives — CREAP Africa Initiative" },
      { name: "description", content: "Explore CREAP's programs in civic education, climate action, youth empowerment, oral health in schools and community dialogue." },
    ],
  }),
  component: Programs,
});

const PROGRAMS = [
  { icon: Scale, title: "Civic Education & Democratic Awareness", body: "Mobilising citizens, youth and communities to understand their rights and actively shape democratic processes across Nigeria." },
  { icon: Heart, title: "Oral Health in Schools Campaign", body: "Empowering learners with knowledge and tools to build lifelong oral hygiene habits — through awareness, education, and community outreach." },
  { icon: Leaf, title: "Greening Communities", body: "Youth volunteers lead environmental clean-up and sustainability actions, turning climate justice into visible, community-level change." },
  { icon: Users, title: "Reaching Communities, Transforming Lives", body: "Grassroots school outreaches and community engagement building a generation of informed, empowered, and resilient citizens." },
  { icon: BookOpen, title: "Knowledge & Skills Empowerment", body: "Digital skills, leadership training, and capacity development — building a generation equipped to drive sustainable change." },
];

function Programs() {
  return (
    <>
      <PageHero
        eyebrow="Programs & Initiatives"
        title={<>Where research meets <em className="italic text-goldf">community action</em></>}
        body="Five interconnected program tracks moving evidence into policy, and policy into measurable change for people and ecosystems."
      />

      <section className="py-24 lg:py-32 bg-bg">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10 space-y-6">
          {PROGRAMS.map(({ icon: Icon, title, body }, i) => (
            <article key={title} className="group grid md:grid-cols-12 gap-8 items-center bg-white border border-rule rounded-sm p-8 lg:p-10 hover:border-gold hover:shadow-md transition-all">
              <div className="md:col-span-1">
                <span className="font-display text-gold text-3xl">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="md:col-span-2">
                <div className="w-16 h-16 grid place-items-center bg-g100 text-g500 group-hover:bg-g600 group-hover:text-white rounded-sm transition">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-display text-2xl mb-2.5">{title}</h3>
                <p className="text-ink3 leading-relaxed">{body}</p>
              </div>
              <div className="md:col-span-2 md:text-right">
                <Link to="/get-involved" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g600 transition">
                  Engage <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-g700 text-white py-20">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 grid lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2">
            <p className="eyebrow mb-4">Virtual Workshop</p>
            <h3 className="display-md text-white">
              Join our next <em className="italic text-goldf">community dialogue</em>
            </h3>
            <p className="mt-4 text-white/70 max-w-xl">
              Quarterly sessions connecting researchers, community leaders and policymakers — open to all.
            </p>
          </div>
          <div className="lg:text-right">
            <Link to="/get-involved" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-7 py-3.5 rounded-sm transition">
              Register Interest <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
