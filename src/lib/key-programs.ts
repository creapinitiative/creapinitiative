import { Earth, Handshake, Sprout, Trophy, Wheat, type LucideIcon } from "lucide-react";

/**
 * The "Our Key Programs" list. A program with `detail` gets a "View more" page
 * at /programs/our-key-programs/<slug>; one without shows just the summary card.
 */
export type ProgramDetail = {
  heroImage: string;
  intro: string[];
  platforms: { title: string; image: string; body: string }[];
  closing: string;
};

export type KeyProgram = {
  slug: string;
  icon: LucideIcon;
  title: string;
  body: string;
  detail?: ProgramDetail;
};

export const KEY_PROGRAMS: KeyProgram[] = [
  {
    slug: "community-peace-champions-fellowship",
    icon: Trophy,
    title: "Community Peace Champions Fellowship",
    body: "The Community Peace Champions Initiative is a grassroots programme that strengthens social cohesion across diverse Nigerian communities by equipping young leaders with peacebuilding skills. Through a structured fellowship, community dialogues, and locally driven action projects, participants foster inclusive solutions to conflict and division.",
  },
  {
    slug: "youth-climate-adaptation-programme",
    icon: Earth,
    title: "Youth Climate Adaptation Programme",
    body: "The Youth Climate Adaptation Programme equips young people with the knowledge, skills, and tools to drive practical climate solutions in their communities. It features intensive training, real-world field exposure, mentorship, and action projects focused on resilience, sustainability, and advocacy.",
  },
  {
    slug: "greening-the-future-initiative",
    icon: Sprout,
    title: "Greening the Future Initiative",
    body: "This initiative promotes environmental sustainability and green livelihoods by engaging communities, schools, and institutions in tree planting, waste management, renewable energy awareness, and environmental advocacy.",
  },
  {
    slug: "youth-skill-development-fund",
    icon: Wheat,
    title: "Youth Skill Development Fund (YSDF) Initiative",
    body: "A structured intervention equipping young Nigerians for an AI-driven economy through practical training in digital skills, innovation, and enterprise. It combines hands-on learning, project incubation, and entrepreneurship support with community-level mentorship.",
  },
  {
    slug: "civic-creaptech",
    icon: Handshake,
    title: "CivicCREAP-Tech",
    body: "A collection of digital applications, platforms and tools that help citizens participate meaningfully in development, track government commitments, and hold institutions accountable.",
    detail: {
      heroImage: "/programs/civic-creaptech/civic-creaptech-hero.png",
      intro: [
        "Civic CREAPTech is a collection of digital applications, platforms, tools, resources and technology-driven strategies developed by CREAP Africa Initiative to empower citizens to participate meaningfully in development, strengthen community accountability, track governance responses, and monitor community-based interventions.",
        "The initiative is built around the belief that technology can make civic participation more accessible, evidence-based and responsive by giving ordinary citizens practical tools to access information, report issues, document government commitments, track interventions, engage decision-makers and contribute ideas to public policies and programmes.",
        "Not a single application, Civic CREAPTech serves as an ecosystem of complementary civic technology solutions addressing different aspects of governance, democracy, climate action, public accountability and community development.",
      ],
      platforms: [
        {
          title: "Climate Accountability Watch (CAWatch)",
          image: "/programs/civic-creaptech/cawatch.png",
          body: "A web-based civic technology platform that helps citizens and communities understand climate-related risks and interventions. It provides access to information on issues such as flooding, environmental degradation and climate adaptation initiatives, while enabling citizens to report incidents, document interventions, follow up on government and institutional responses, and assess the implementation and reach of climate interventions. The platform can generate community-level evidence that supports advocacy, planning and accountability.",
        },
        {
          title: "Promise Tracker",
          image: "/programs/civic-creaptech/promise-tracker.png",
          body: "An online civic participation and accountability space that enables citizens to document political campaign promises and public commitments, track progress after elections, engage representatives, raise concerns, and contribute ideas to government policies and programmes. It creates a structured link between commitments made by public officials and the expectations and experiences of citizens, helping communities follow the journey from promises to implementation.",
        },
      ],
      closing:
        "Through Civic CREAPTech, CREAP Africa Initiative seeks to move citizens from being passive recipients of development interventions to informed participants, monitors, contributors and co-creators of solutions. The initiative combines technology with community engagement, civic education, research, data and advocacy to create practical pathways for citizens to influence development and hold institutions accountable.",
    },
  },
];
