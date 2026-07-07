import callForApplicationsImage from "@/assets/Call for applications.jpeg";

export type UpcomingProgram = {
  slug: string;
  title: string;
  subtitle: string;
  theme: string;
  image: string;
  summary: string;
  audience: string[];
  date: string;
  venue: string;
  skills: string[];
  applyUrl: string;
  applicationDeadline: string;
  closingNote: string;
  partnerNote?: string;
  hashtags: string[];
};

export const UPCOMING_PROGRAMS: UpcomingProgram[] = [
  {
    slug: "safe-civic-engagement-workshop-abuja-aug-2026",
    title: "CALL FOR APPLICATIONS!",
    subtitle: "3-Day Capacity Building Workshop",
    theme:
      "Safe Civic Engagement in Practice: Building Skills for Advocacy, Accountability, and Responsible Action",
    image: callForApplicationsImage,
    summary:
      "Building skills for advocacy, accountability, and responsible action for people committed to democracy, human rights, and community development.",
    audience: [
      "Youth Leaders",
      "Civil Society Actors",
      "Human Rights Advocates",
      "Community Stakeholders",
      "Community-Based Organizations (CBOs)",
      "Persons with Disabilities (PWDs)",
      "Women Leaders and Grassroots Advocates",
    ],
    date: "26-28 August 2026",
    venue: "Abuja, Nigeria",
    skills: [
      "Civic Rights and Responsibilities",
      "Advocacy and Policy Engagement",
      "Peaceful Civic Participation",
      "Digital Civic Engagement",
      "Community Organising and Leadership",
      "Accountability and Democratic Governance",
    ],
    applyUrl: "https://bit.ly/civic-engagement-training",
    applicationDeadline: "Friday 24th July 2026",
    closingNote:
      "Together, we build a more informed, inclusive, and resilient civic space.",
    partnerNote: "CIVICUS: World Alliance for Citizen Participation",
    hashtags: [
      "SafeCivicEngagement",
      "YouthVoicesNG",
      "ProtectCivicSpace",
      "EngageSafelyLeadChange",
      "MakeDemocracyWork",
    ],
  },
];

export const UPCOMING_PROGRAMS_BY_SLUG = Object.fromEntries(
  UPCOMING_PROGRAMS.map((program) => [program.slug, program]),
) as Record<string, UpcomingProgram>;
