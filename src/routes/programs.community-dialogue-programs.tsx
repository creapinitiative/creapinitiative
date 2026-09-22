import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { Download } from "lucide-react";

export const Route = createFileRoute("/programs/community-dialogue-programs")({
  head: () => ({
    meta: [
      { title: "Community Dialogue Programs — CREAP Africa Initiative" },
      { name: "description", content: "Dialogue sessions focused on active citizenship, inclusion, justice, and climate resilience." },
    ],
  }),
  component: CommunityDialogueProgramsPage,
});

const DIALOGUES = [
  {
    title: "Climate Change Rhetoric: Challenging Active Citizenship and Actions",
    body: "A dialogue exploring how climate change narratives can be channelled into active civic engagement and community-level action.",
  },
  {
    title: "Promoting Grassroot Governance through Citizen Participation",
    body: "Examining mechanisms through which ordinary citizens can meaningfully participate in local governance and public decision-making.",
  },
  {
    title: "Safeguarding Accountability: The Future of Anti-Corruption Efforts in Nigeria",
    body: "A forum on strengthening accountability systems and anti-corruption frameworks in the Nigerian public sector.",
  },
  {
    title: "How Ordinary Citizens Can Win the Fight Against Injustice",
    body: "Empowering community members with knowledge, tools, and strategies to challenge systemic injustice and advocate for their rights.",
  },
  {
    title: "Amplifying Marginalized Voices: Empowering Women and Youth in Crisis",
    body: "Spotlighting the unique vulnerabilities and untapped potential of women and youth in conflict and crisis settings.",
  },
  {
    title: "Greening the Future: Exploring Solutions for Nigeria's Environmental Challenges",
    body: "A national conversation on actionable environmental solutions addressing deforestation, pollution, and climate vulnerability.",
  },
  {
    title: "Reconstructing the Nigeria State Amidst Economic Instability: A Discourse",
    body: "A reflective dialogue on governance reform, economic resilience, and pathways to national development amid instability.",
  },
  {
    title: "The Petroleum Industry Act 2021 and Host Community Relations",
    body: "Examining the challenges, opportunities and best practices in host community relations under Nigeria's landmark petroleum legislation.",
  },
  {
    title: "Building Resilient Communities: Youth-led Climate Adaptation, Food Security and Local Peace — Oct 2025",
    body: "A multi-thematic dialogue bringing together youth leaders to chart pathways for resilient, food-secure, and peaceful communities.",
  },
  {
    title: "Reclaiming the Climate Future: Youth Power, Policy Gaps and Pathway Forward — June 2025",
    body: "Youth-centred policy dialogue identifying critical gaps in Nigeria's climate response and proposing pathways forward.",
  },
  {
    title: "Youth Driving Climate-Smart Agriculture and Peacebuilding for SDGs Localization — Aug 2025",
    body: "An intersectional dialogue linking climate-smart agriculture and peacebuilding to the localization of the SDGs in Nigeria.",
  },
  {
    title: "Leveraging Climate-Smart Agriculture and AI for Sustainable Food Systems — July 2025",
    body: "Exploring how artificial intelligence can be responsibly integrated into climate-smart agriculture to advance food security.",
  },
  {
    title: "ACT NOW: Strengthening Civic Trust and Fostering Inclusive Pathways to a Peaceful World",
    body: "A call-to-action forum on rebuilding civic trust, promoting inclusion, and fostering pathways to sustainable peace.",
  },
];

function CommunityDialogueProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Home / Programs / Community Dialogue Programs"
        title="Community Dialogue Programs"
        body="We create safe spaces where communities come together to discuss challenges, share ideas, and develop collective solutions."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="rounded-sm border border-rule bg-white overflow-hidden">
            {DIALOGUES.map((item, index) => (
              <RevealItem
                key={item.title}
                as="article"
                index={index}
                step={0.05}
                className={[
                  "grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-8 items-start px-6 py-7 md:px-9 md:py-8",
                  index !== DIALOGUES.length - 1 ? "border-b border-rule" : "",
                ].join(" ")}
              >
                <p className="font-display text-4xl text-gold/60 leading-none mt-1">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-body font-semibold text-[1.06rem] text-ink mb-2.5 leading-snug">{item.title}</h2>
                  <p className="text-ink3 leading-relaxed">{item.body}</p>
                </div>
                <a
                  href="#"
                  className="shrink-0 inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
                >
                  Download Report <Download size={13} />
                </a>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
