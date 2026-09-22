// One-time seed script: populates Supabase with every piece of content that
// was hardcoded in the site before the CMS existed, so the dashboard starts
// perfectly in sync with what's live today.
//
// Usage (after creating your Supabase project and running supabase/schema.sql):
//   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-supabase.mjs
// or put those two vars in a local .env and run:
//   node --env-file=.env scripts/seed-supabase.mjs
//
// Safe to re-run: it clears each table before inserting, so running it twice
// just re-seeds the same data rather than duplicating rows.

import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const RAW = "https://raw.githubusercontent.com/kingsmac1/creapinitiative-website-redesign/main";

async function seedTable(table, rows) {
  const { error: deleteError } = await supabase.from(table).delete().not("id", "is", null);
  if (deleteError) throw new Error(`${table}: ${deleteError.message}`);

  const { error: insertError } = await supabase.from(table).insert(rows);
  if (insertError) throw new Error(`${table}: ${insertError.message}`);

  console.log(`Seeded ${rows.length} row(s) into ${table}`);
}

// ── Policy Briefs ────────────────────────────────────────────────────────
await seedTable(
  "policy_briefs",
  [
    { title: "Promoting Peace and Security in the Face of Emerging Global Threats", body: "Examining peacebuilding strategies in the context of evolving global security challenges.", date: "May 2026", sort_order: 0 },
    { title: "Balancing Innovation and Caution in Our Quest for Food Security", body: "Evidence-based pathways to agricultural innovation that maintain ecological integrity.", date: "August 2025", file_url: "/reports/policy-brief-food-security-2025.pdf", sort_order: 1 },
    { title: "Climate-Smart Agriculture and AI for Sustainable Food Systems in Nigeria", body: "A practical brief on integrating AI responsibly into agricultural adaptation and food system resilience.", date: "March 2026", sort_order: 2 },
    { title: "Citizen Participation and Inclusive Governance in Local Communities", body: "Recommendations for strengthening meaningful public participation in local decision-making processes.", date: "February 2026", sort_order: 3 },
    { title: "Youth Voices in Climate Policy: Bridging Local Experience and National Action", body: "How youth-led adaptation experiences can shape stronger and more responsive policy frameworks.", date: "January 2026", sort_order: 4 },
    { title: "Civic Trust and Social Cohesion in Fragile Contexts", body: "Strategies for rebuilding trust through dialogue, transparency, and inclusive service delivery.", date: "December 2025", sort_order: 5 },
  ],
);

// ── Reports (annual, project, financial) ────────────────────────────────
await seedTable(
  "reports",
  [
    { category: "annual", title: "CREAP 2025 Annual Report", subtitle: "The Year of Momentum", body: "A look back at a year of expanded programs, new partnerships and deepening community impact across Nigeria.", date: "2025", file_url: "/reports/creap-annual-report-2025-the-year-of-momentum.pdf", sort_order: 0 },
    { category: "annual", title: "CREAP 2024 Annual Report", subtitle: "A Bold Beginning", body: "Our founding year in review — the programs, partnerships and communities that shaped CREAP Africa Initiative's first chapter.", date: "2024", file_url: "/reports/creap-annual-report-2024-a-bold-beginning.pdf", sort_order: 1 },
    { category: "project", title: "16-Days of Activism Report", subtitle: "End Digital Violence Against Women and Girls", body: "A review of CREAP's 2025 16 Days of Activism campaign — radio advocacy, a special webinar, national conference participation, multistakeholder dialogues and field outreach promoting safer physical and digital spaces for women and girls.", date: "December 2025", file_url: "/reports/16-days-activism-report-2025.pdf", sort_order: 0 },
    { category: "project", title: "Project Report", subtitle: "Youth Skills and Digital Future Initiative", body: "Findings from the Youth Skills and Digital Future Initiative in Niger State, equipping young Nigerians with digital skills, innovation and enterprise training.", date: "August 2024", file_url: "/reports/youth-skills-and-digital-future-initiative.pdf", sort_order: 1 },
    { category: "financial", title: "Financial Report", subtitle: "FY2025", body: "Summary of income and expenditure for the 2025 financial year.", date: "2025", file_url: "/reports/creap-financial-report-fy2025.pdf", sort_order: 0 },
    { category: "financial", title: "Financial Report", subtitle: "FY2024", body: "Summary of income and expenditure for the 2024 financial year.", date: "2024", file_url: "/reports/creap-financial-report-fy2024.pdf", sort_order: 1 },
  ],
);

// ── Blog Posts ───────────────────────────────────────────────────────────
await seedTable(
  "blog_posts",
  [
    {
      slug: "building-local-climate-solutions-with-youth",
      title: "Building Local Climate Solutions With Youth",
      excerpt: "How youth-led adaptation labs are helping communities turn climate risks into practical and inclusive solutions.",
      image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
      category: "Climate Action",
      date: "June 14, 2026",
      author: "CREAP Editorial Team",
      read_minutes: "6 min read",
      sort_order: 0,
      content: [
        "Across several communities, climate disruption is no longer an abstract idea. Families experience changing rainfall patterns, declining soil quality, and new pressure on local livelihoods. In response, youth groups are stepping up with practical experiments that blend indigenous knowledge with modern tools.",
        "Through adaptation labs, participants test low-cost methods for water retention, seed preservation, and cooperative planning. These labs are designed to be participatory, so farmers, teachers, and local leaders can jointly evaluate what works and what should be improved.",
        "The most important outcome is not just technical. It is social. Youth are becoming trusted conveners in their communities, helping bridge institutions and citizens while creating solutions that can scale responsibly.",
      ],
    },
    {
      slug: "community-dialogue-and-the-path-to-social-cohesion",
      title: "Community Dialogue and the Path to Social Cohesion",
      excerpt: "What we learned from sustained dialogue sessions on trust, participation, and collaborative problem-solving.",
      image_url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80",
      category: "Civic Participation",
      date: "May 29, 2026",
      author: "CREAP Programs Unit",
      read_minutes: "7 min read",
      sort_order: 1,
      content: [
        "Dialogue works best when it is structured, inclusive, and recurring. One-off conversations can surface issues, but sustained sessions are what build confidence among participants and deepen accountability.",
        "Our recent dialogue cycle focused on practical themes: local service delivery, youth inclusion, and conflict-sensitive communication. Facilitators used small-group formats to ensure quieter voices were not crowded out by dominant perspectives.",
        "When dialogue is paired with follow-through actions, communities begin to see institutions as partners rather than distant actors. This trust is essential for long-term peacebuilding and democratic participation.",
      ],
    },
    {
      slug: "oral-health-in-schools-why-early-habits-matter",
      title: "Oral Health in Schools: Why Early Habits Matter",
      excerpt: "Inside the OHIS project and why prevention-focused school health education creates long-term benefits.",
      image_url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80",
      category: "Health Education",
      date: "April 17, 2026",
      author: "OHIS Project Team",
      read_minutes: "5 min read",
      sort_order: 2,
      content: [
        "The Oral Health in Schools project is built on a simple principle: prevention should begin early. By introducing children to practical oral hygiene routines, schools can reduce avoidable health burdens and improve wellbeing outcomes.",
        "In pilot schools, trained facilitators delivered age-appropriate sessions and distributed learning materials including Teach Me to Smile and An Easy Bite. Teachers and school health workers reinforced these lessons with follow-up activities.",
        "Early behavior change has compounding effects. Students share what they learn at home, caregivers become more informed, and communities gain stronger awareness of preventive health practices.",
      ],
    },
    {
      slug: "from-policy-briefs-to-public-action",
      title: "From Policy Briefs to Public Action",
      excerpt: "Turning evidence into advocacy through clear communication, stakeholder alignment, and local ownership.",
      image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
      category: "Policy",
      date: "March 8, 2026",
      author: "Research and Policy Team",
      read_minutes: "8 min read",
      sort_order: 3,
      content: [
        "Policy briefs are most effective when they simplify complexity without losing rigor. They should answer three questions clearly: what is the issue, what evidence supports change, and what practical step should decision-makers take next.",
        "At CREAP, briefs are co-developed with program insights so recommendations reflect field realities. This approach helps bridge research and implementation while improving the odds of adoption by stakeholders.",
        "Evidence alone is not enough. Uptake depends on clear framing, timely engagement, and trusted relationships that can move recommendations into measurable action.",
      ],
    },
  ],
);

// ── Upcoming Programs ────────────────────────────────────────────────────
await seedTable(
  "upcoming_programs",
  [
    {
      slug: "safe-civic-engagement-workshop-abuja-aug-2026",
      title: "CALL FOR APPLICATIONS!",
      subtitle: "3-Day Capacity Building Workshop",
      theme: "Safe Civic Engagement in Practice: Building Skills for Advocacy, Accountability, and Responsible Action",
      image_url: `${RAW}/src/assets/call-for-applications.jpeg`,
      summary: "Building skills for advocacy, accountability, and responsible action for people committed to democracy, human rights, and community development.",
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
      apply_url: "https://bit.ly/civic-engagement-training",
      application_deadline: "Friday 24th July 2026",
      closing_note: "Together, we build a more informed, inclusive, and resilient civic space.",
      partner_note: "CIVICUS: World Alliance for Citizen Participation",
      hashtags: ["SafeCivicEngagement", "YouthVoicesNG", "ProtectCivicSpace", "EngageSafelyLeadChange", "MakeDemocracyWork"],
      sort_order: 0,
    },
  ],
);

// ── Gallery Images ───────────────────────────────────────────────────────
const galleryPrefix = `${RAW}/src/assets/gallery`;
await seedTable(
  "gallery_images",
  [
    ["oral-health-campaign-20.jpg", "CREAP staff and school officials hold up the Oral Health in Schools campaign banner", false],
    ["oral-health-campaign-01.jpg", "Students and teachers rally behind the Oral Health in Schools campaign banner", false],
    ["oral-health-campaign-13.jpg", "The wider school community poses with the campaign banner", false],
    ["oral-health-campaign-07.jpg", "Facilitators review outreach materials ahead of the school session", true],
    ["oral-health-campaign-04.jpg", "Learners hold up oral hygiene awareness flyers with the CREAP team", false],
    ["oral-health-campaign-18.jpg", "A pupil addresses the school on healthy oral hygiene habits", false],
    ["oral-health-campaign-06.jpg", "Pupils celebrate their new toothbrushes at the campaign send-off", false],
    ["oral-health-campaign-24.jpg", "A pupil, teacher and CREAP staff member share the hygiene flyer", true],
    ["oral-health-campaign-02.jpg", "The school community gathers for the oral health awareness campaign", false],
    ["oral-health-campaign-09.jpg", "Facilitators brief the class using the campaign's roll-up banner", false],
    ["oral-health-campaign-12.jpg", "Excited pupils wave their new toothbrushes", false],
    ["oral-health-campaign-15.jpg", "A pupil and teacher share the oral hygiene flyer", false],
    ["oral-health-campaign-22.jpg", "The team poses together with the oral health campaign banner", false],
    ["oral-health-campaign-10.jpg", "Pupils and teachers display their oral hygiene flyers", false],
    ["oral-health-campaign-19.jpg", "A candid moment as the team celebrates a successful outreach", false],
    ["oral-health-campaign-03.jpg", "Pupils and staff pose together at the campaign banner", false],
    ["oral-health-campaign-16.jpg", "Close-up with the 'Naflax is Smiling Bright' hygiene flyer", true],
    ["oral-health-campaign-14.jpg", "Pupils raise their toothbrushes in celebration", false],
    ["oral-health-campaign-05.jpg", "Pupils and facilitators share the 'Naflax is Smiling Bright' hygiene flyer", false],
    ["oral-health-campaign-23.jpg", "The pupil continues the oral health talk before the campaign banner", false],
    ["oral-health-campaign-08.jpg", "A pre-outreach briefing session at the school", false],
    ["oral-health-campaign-11.jpg", "More learners join the flyer distribution exercise", false],
    ["oral-health-campaign-17.jpg", "Another cheerful toothbrush celebration moment", false],
    ["oral-health-campaign-21.jpg", "The full campaign banner, detailing the Gosa Junior Secondary School outreach", false],
    ["radio-maria-01.jpg", "On air at Radio Maria 91.3FM, Abuja", true],
    ["radio-maria-03.jpg", "The CREAP team with the Radio Maria FM banner", false],
    ["radio-maria-07.jpg", "The panel discussion continues in the studio", false],
    ["radio-maria-02.jpg", "Discussing CREAP's work live on Radio Maria", true],
    ["radio-maria-06.jpg", "Roundtable discussion in the Radio Maria studio", false],
    ["radio-maria-10.jpg", "The team celebrates after the broadcast", true],
    ["radio-maria-04.jpg", "Team photo after the on-air segment", false],
    ["radio-maria-09.jpg", "A wider view of the studio roundtable", false],
    ["radio-maria-05.jpg", "Another group photo at the Radio Maria studio", false],
    ["radio-maria-08.jpg", "Guests in conversation on air", false],
    ["sarcs-conference.jpg", "Representing CREAP at the 11th Network Conference of Sexual Assault Referral Centers (SARCs)", true],
    ["16-days-activism.jpg", "Marking the 16 Days of Activism Against Sexual & Gender-Based Violence", false],
  ].map(([file, caption, tall], index) => ({
    image_url: `${galleryPrefix}/${file}`,
    caption,
    tall,
    sort_order: index,
  })),
);

// ── Leadership Roster ────────────────────────────────────────────────────
const leadershipPrefix = `${RAW}/src/assets/leadership`;
function member(name, role, team, order, photoFile) {
  return {
    name,
    role,
    team,
    sort_order: order,
    photo_url: photoFile ? `${leadershipPrefix}/${photoFile}` : null,
  };
}

await seedTable("leadership", [
  member("Sylvanus Udoenoh", "Founder & Executive Director", "executive", 0, "sylvanus-udoenoh.jpg"),
  member("Marvin O. Joseph", "Director of Programs", "executive", 1, "marvin-joseph.jpg"),
  member("Monday Peter", "Director of Finance", "executive", 2, "monday-peter.jpg"),
  member("Abdullahi Sani", "Operations Manager", "executive", 3, "abdullahi-sani.jpg"),

  member("Pastor Daniel Ologe", "MEAL Specialist", "management", 0, "daniel-ologe.jpg"),
  member("Gloria Uke Kehinde", "Community Engagement Specialist", "management", 1, "gloria-uke-kehinde.jpg"),
  member("Kayode Olonidu", "Legal & Research Specialist", "management", 2, "kayode-olonidu.jpg"),
  member("Shafaátu Aliyu", "Administrative & Liaison Officer", "management", 3, "shafaatu-aliyu.jpg"),
  member("Victor Jacob", "Procurement Specialist", "management", 4, "victor-jacob.jpg"),
  member("Samuel Brown", "Communications & Media Officer", "management", 5, "samuel-brown.jpg"),
  member("Ibrahim Mustapha", "Data Analyst", "management", 6, null),
  member("Aliyu B. Ali, PhD", "Public Policy Specialist", "management", 7, "aliyu-b-ali.jpg"),
  member("Camilus Ekujere", "Community Development Specialist", "management", 8, "camilus-ekujere.jpg"),
  member("Victoria Robson", "Project Coordinator", "management", 9, null),

  member("Khadijah Muhammad", "Niger State (Programs Lead)", "state", 0, "khadijah-muhammad.jpg"),
  member("Samuel Eteudo", "Akwa Ibom State (Programs Lead)", "state", 1, "samuel-eteudo.jpg"),
  member("Juliet Nkwaeze", "Sokoto State (Programs Lead)", "state", 2, "juliet-nkwaeze.jpg"),
  member("Martin Ibrahim", "Plateau State (Programs Lead)", "state", 3, "martin-ibrahim.jpg"),
  member("Ahmed Babi", "Yobe State (Programs Lead)", "state", 4, "ahmed-babi.jpg"),
  member("Anas Abubakar", "Sokoto (Community Engagement Manager)", "state", 5, null),
  member("Mercy Aniekan Udom", "Community Engagement Officer, Akwa Ibom State", "state", 6, "mercy-aniekan-udom.jpg"),
]);

console.log("\nDone — the dashboard now matches what's currently live on the site.");
