import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Sparkle, Shield } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CREAP Africa Initiative" },
      { name: "description", content: "A nonprofit committed to empowering marginalized and underserved communities through people-centered, rights-based, sustainable development solutions." },
    ],
  }),
  component: About,
});

const DRIVERS = [
  { title: "Evidence, Innovation & Learning", body: "We use research, data and community-generated evidence to inform policies, improve programs and scale impact responsibly." },
  { title: "Equity & Inclusion", body: "Pursuit of policies and systems that ensure access to opportunities for marginalized populations regardless of gender, location or socioeconomic status." },
  { title: "Participatory Governance", body: "CREAP promotes civic participation and public accountability so communities can influence decisions that affect their lives." },
  { title: "Sustainability & Climate Resilience", body: "We advance environmentally responsible development, climate adaptation, and sustainable livelihoods protecting ecosystems and future generations." },
  { title: "Strengthening Social Cohesion", body: "We constantly work to promote peace, civic education, and social rights, recognising that development cannot thrive without social cohesion." },
  { title: "Empowerment through Knowledge", body: "Across all thematic areas, CREAP invests in civic education, digital skills, leadership training, and capacity development." },
  { title: "Multistakeholder Collaboration", body: "Our work is powered by collaboration with strategic public and private agencies, institutions, and partners." },
  { title: "Organizational Excellence", body: "Through strong internal governance, monitoring, evaluation systems, ethical practices, and accountability to the communities we serve." },
];

const VALUES = [
  { emoji: "⚖️", label: "Equity" },
  { emoji: "🤝", label: "Integrity" },
  { emoji: "👤", label: "People-Centered" },
  { emoji: "🔗", label: "Collaboration" },
  { emoji: "💡", label: "Innovation" },
  { emoji: "🌱", label: "Sustainability" },
  { emoji: "💚", label: "Empathy" },
];

const OBJECTIVES = [
  "To implement impactful programs that contribute to the social development of grassroot communities.",
  "To provide accessible resources and platforms for communities to actively participate in the overall development of their communities, and promote inclusive decision-making processes.",
  "To serve as a catalyst for positive change by advocating for sustainable livelihood, inclusive governance, community participation, social justice and human rights through community-driven initiatives.",
  "To foster productive collaboration among diverse stakeholders to create synergies that enhance the effectiveness of our initiatives, promoting collective action for positive change.",
  "To mobilize citizens to take an active role in shaping their communities' future, promoting a sense of ownership and responsibility.",
  "To empower local communities through skill development and capacity building initiatives that enhance their ability to advocate for their rights and interests.",
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Home / About Us"
        title="About CREAP Africa Initiative"
        body="A nonprofit committed to empowering marginalized and underserved communities through people-centered, rights-based, sustainable development solutions."
      />

      {/* Our Story */}
      <section className="py-24 lg:py-28 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3">
            <p className="eyebrow-dark mb-4">Our Story</p>
            <h2 className="display-lg mb-6">Who We Are</h2>
            <div className="space-y-5 text-ink3 leading-relaxed">
              <p>
                CREAP Africa Initiative (Community Rights Education Advancement Pathway Initiative) is a nonprofit organization committed to empowering marginalized and underserved communities through people-centered, rights-based, sustainable development solutions.
              </p>
              <p>
                CREAP collaborates with local, national and international institutions to design and implement programs that promote advocacy, knowledge-sharing, leadership development, and civic participation. Through diverse thematic programs, CREAP addresses critical social and environmental challenges.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-g900 text-white rounded-sm p-9 lg:p-10">
            <p className="text-[11px] tracking-[0.16em] uppercase text-gold font-semibold">Established</p>
            <div className="font-display text-5xl text-gold3 mt-3 mb-4">Oct 2021</div>
            <p className="text-white/60 leading-relaxed">
              Formally registered in July 2024 under the Companies and Allied Matters Act, 2020 of the Corporate Affairs Commission
            </p>

            <div className="my-7 border-t border-white/10" />

            <p className="text-[11px] tracking-[0.16em] uppercase text-gold font-semibold">Mandate</p>
            <p className="text-white/60 leading-relaxed mt-3">
              Implemented through strategic thematic focus areas in{" "}
              <strong className="text-white font-semibold">Peace and Democracy, Climate Change and Sustainability</strong>, and{" "}
              <strong className="text-white font-semibold">Youth Empowerment and Inclusive Development</strong>
            </p>
          </div>
        </Reveal>
      </section>

      {/* Vision & Mission */}
      <section className="bg-g900 py-16 lg:py-20">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="grid md:grid-cols-2 rounded-sm overflow-hidden">
            <div className="bg-g700 p-10 lg:p-14">
              <div className="w-14 h-14 rounded-sm bg-white/10 grid place-items-center mb-8">
                <Sparkle size={24} className="text-gold" strokeWidth={1.5} />
              </div>
              <p className="eyebrow mb-4">Vision</p>
              <div className="font-display text-2xl lg:text-[1.7rem] text-white leading-snug">
                Inclusive, resilient and empowered communities where rights are protected, opportunities are accessible, and sustainable development thrives.
              </div>
            </div>
            <div className="bg-gold p-10 lg:p-14">
              <div className="w-14 h-14 rounded-sm bg-g900/15 grid place-items-center mb-8">
                <Shield size={24} className="text-g900" strokeWidth={1.5} />
              </div>
              <p className="text-[11px] tracking-[0.16em] uppercase text-g900/70 font-semibold mb-4">Mission</p>
              <div className="font-display text-2xl lg:text-[1.7rem] text-g900 leading-snug">
                Empowering marginalized and underserved communities through people-centred, rights-based, and sustainable development solutions in advocacy, knowledge-sharing, skills development and leadership strategies
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Key Drivers */}
      <section className="bg-bg py-24 lg:py-28">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="mb-14">
            <p className="eyebrow-dark mb-4">What Drives Us</p>
            <h2 className="display-lg">
              Our Key <em className="text-g500 italic">Drivers</em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 border border-rule rounded-sm overflow-hidden bg-white">
            {DRIVERS.map(({ title, body }, idx) => (
              <RevealItem
                key={title}
                as="div"
                index={idx}
                y={16}
                className={[
                  "p-9 flex gap-6",
                  idx % 2 === 0 ? "md:border-r border-rule" : "",
                  idx < DRIVERS.length - 2 ? "border-b border-rule" : "",
                ].join(" ")}
              >
                <span className="font-display text-3xl text-gold shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-semibold text-ink mb-2">{title}</h4>
                  <p className="text-sm text-ink3 leading-relaxed">{body}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Core Values */}
      <section className="bg-g50 py-24 lg:py-28">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">What Drives Us</p>
          <h2 className="display-lg mb-10">
            Core <em className="text-g500 italic">Values</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            {VALUES.map((v, idx) => (
              <RevealItem
                key={v.label}
                as="span"
                index={idx}
                step={0.05}
                y={12}
                className="inline-flex items-center gap-2 bg-white border border-rule rounded-sm px-5 py-3 text-sm text-ink2"
              >
                <span className="text-base">{v.emoji}</span> {v.label}
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Strategic Objectives */}
      <section className="bg-bg py-24 lg:py-28">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Our Direction</p>
          <h2 className="display-lg mb-16">
            Strategic <em className="text-g500 italic">Objectives</em>
          </h2>
          <div>
            {OBJECTIVES.map((body, idx) => (
              <RevealItem
                key={body}
                as="div"
                index={idx}
                step={0.06}
                y={14}
                className={[
                  "grid grid-cols-[64px_1fr] md:grid-cols-[96px_1fr] gap-6 py-8",
                  idx !== OBJECTIVES.length - 1 ? "border-b border-rule" : "",
                ].join(" ")}
              >
                <span className="font-display text-3xl text-gold/70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="text-ink2 leading-relaxed pt-1">{body}</p>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
