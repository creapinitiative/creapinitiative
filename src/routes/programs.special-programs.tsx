import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download, Stethoscope, Tractor, MonitorSmartphone } from "lucide-react";

export const Route = createFileRoute("/programs/special-programs")({
  head: () => ({
    meta: [
      { title: "Special Programs — CREAP Africa Initiative" },
      { name: "description", content: "Special programs including oral health in schools and climate-smart agriculture." },
    ],
  }),
  component: SpecialProgramsPage,
});

const SPECIAL_PROGRAMS = [
  {
    icon: Stethoscope,
    title: "Oral Health in Schools (OHIS) Project",
    body: "A school-based initiative focused on improving oral health outcomes among children through education, awareness, and access to basic dental care. The pilot program delivered oral hygiene education, trained school health workers, and distributed educational materials including Teach Me to Smile and An Easy Bite.",
  },
  {
    icon: Tractor,
    title: "Climate-Smart Agriculture Program",
    body: "This program promotes sustainable agricultural practices resilient to climate shocks while improving food security and farmer livelihoods, integrating AI tools to enhance precision farming, crop management, and value chain development.",
  },
  {
    icon: MonitorSmartphone,
    title: "CivicCREAP-Tech",
    body: "An emerging digital civic platform designed to harness technology for community participation, accountability, and responsive governance. This special program is currently in development.",
  },
];

function SpecialProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Programs / Special Programs"
        title="Special Programs"
        body="Targeted initiatives that combine health, innovation and sustainability for measurable community impact."
      />

      <section className="bg-bg py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {SPECIAL_PROGRAMS.map(({ icon: Icon, title, body }, idx) => (
            <RevealItem
              key={title}
              as="article"
              index={idx}
              className="bg-white border border-rule rounded-sm p-8 flex flex-col hover:border-gold hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center mb-6">
                <Icon size={24} strokeWidth={1.7} />
              </div>
              <h2 className="font-display text-3xl leading-tight mb-4">{title}</h2>
              <p className="text-ink3 leading-relaxed flex-1">{body}</p>
              <a
                href="#"
                className="mt-7 inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition w-fit"
              >
                Download Report <Download size={13} />
              </a>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
