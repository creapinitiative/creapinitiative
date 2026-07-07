import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Earth, Handshake, Sprout, Trophy, Wheat, Download } from "lucide-react";

export const Route = createFileRoute("/programs/our-key-programs")({
  head: () => ({
    meta: [
      { title: "Our Key Programs — CREAP Africa Initiative" },
      { name: "description", content: "Explore CREAP's core programs driving social cohesion, climate action, and youth empowerment." },
    ],
  }),
  component: OurKeyProgramsPage,
});

const PROGRAMS = [
  {
    icon: Trophy,
    title: "Community Peace Champions Fellowship",
    body: "The Community Peace Champions Initiative is a grassroots programme that strengthens social cohesion across diverse Nigerian communities by equipping young leaders with peacebuilding skills. Through a structured fellowship, community dialogues, and locally driven action projects, participants foster inclusive solutions to conflict and division.",
  },
  {
    icon: Earth,
    title: "Youth Climate Adaptation Programme",
    body: "The Youth Climate Adaptation Programme equips young people with the knowledge, skills, and tools to drive practical climate solutions in their communities. It features intensive training, real-world field exposure, mentorship, and action projects focused on resilience, sustainability, and advocacy.",
  },
  {
    icon: Sprout,
    title: "Greening the Future Initiative",
    body: "This initiative promotes environmental sustainability and green livelihoods by engaging communities, schools, and institutions in tree planting, waste management, renewable energy awareness, and environmental advocacy.",
  },
  {
    icon: Wheat,
    title: "Youth Skill Development Fund (YSDF) Initiative",
    body: "A structured intervention equipping young Nigerians for an AI-driven economy through practical training in digital skills, innovation, and enterprise. It combines hands-on learning, project incubation, and entrepreneurship support with community-level mentorship.",
  },
  {
    icon: Handshake,
    title: "CivicCREAP-Tech",
    body: "An emerging platform designed to harness technology in driving civic participation, governance, and community development. Programme in development with additional content coming soon.",
  },
];

function OurKeyProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Programs / Our Key Programs"
        title="Our Key Programs"
        body="We empower communities through initiatives focused on sustainability, social cohesion and youth empowerment."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <div className="mx-auto max-w-[1300px] px-16 lg:px-28">
          <div className="rounded-sm border border-rule bg-white overflow-hidden">
            {PROGRAMS.map(({ icon: Icon, title, body }, index) => (
              <article
                key={title}
                className={[
                  "grid grid-cols-1 md:grid-cols-[92px_1fr_auto] gap-6 md:gap-8 items-start px-6 py-8 md:px-10 md:py-10",
                  index !== PROGRAMS.length - 1 ? "border-b border-rule" : "",
                ].join(" ")}
              >
                <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center mt-1">
                  <Icon size={24} strokeWidth={1.7} />
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-tight mb-3">{title}</h2>
                  <p className="text-ink3 leading-relaxed max-w-4xl">{body}</p>
                </div>
                <a
                  href="#"
                  className="shrink-0 inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
                >
                  Download Report <Download size={13} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
