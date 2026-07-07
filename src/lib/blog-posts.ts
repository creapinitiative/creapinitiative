export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readMinutes: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-local-climate-solutions-with-youth",
    title: "Building Local Climate Solutions With Youth",
    excerpt:
      "How youth-led adaptation labs are helping communities turn climate risks into practical and inclusive solutions.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
    category: "Climate Action",
    date: "June 14, 2026",
    author: "CREAP Editorial Team",
    readMinutes: "6 min read",
    content: [
      "Across several communities, climate disruption is no longer an abstract idea. Families experience changing rainfall patterns, declining soil quality, and new pressure on local livelihoods. In response, youth groups are stepping up with practical experiments that blend indigenous knowledge with modern tools.",
      "Through adaptation labs, participants test low-cost methods for water retention, seed preservation, and cooperative planning. These labs are designed to be participatory, so farmers, teachers, and local leaders can jointly evaluate what works and what should be improved.",
      "The most important outcome is not just technical. It is social. Youth are becoming trusted conveners in their communities, helping bridge institutions and citizens while creating solutions that can scale responsibly.",
    ],
  },
  {
    slug: "community-dialogue-and-the-path-to-social-cohesion",
    title: "Community Dialogue and the Path to Social Cohesion",
    excerpt:
      "What we learned from sustained dialogue sessions on trust, participation, and collaborative problem-solving.",
    image:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=80",
    category: "Civic Participation",
    date: "May 29, 2026",
    author: "CREAP Programs Unit",
    readMinutes: "7 min read",
    content: [
      "Dialogue works best when it is structured, inclusive, and recurring. One-off conversations can surface issues, but sustained sessions are what build confidence among participants and deepen accountability.",
      "Our recent dialogue cycle focused on practical themes: local service delivery, youth inclusion, and conflict-sensitive communication. Facilitators used small-group formats to ensure quieter voices were not crowded out by dominant perspectives.",
      "When dialogue is paired with follow-through actions, communities begin to see institutions as partners rather than distant actors. This trust is essential for long-term peacebuilding and democratic participation.",
    ],
  },
  {
    slug: "oral-health-in-schools-why-early-habits-matter",
    title: "Oral Health in Schools: Why Early Habits Matter",
    excerpt:
      "Inside the OHIS project and why prevention-focused school health education creates long-term benefits.",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80",
    category: "Health Education",
    date: "April 17, 2026",
    author: "OHIS Project Team",
    readMinutes: "5 min read",
    content: [
      "The Oral Health in Schools project is built on a simple principle: prevention should begin early. By introducing children to practical oral hygiene routines, schools can reduce avoidable health burdens and improve wellbeing outcomes.",
      "In pilot schools, trained facilitators delivered age-appropriate sessions and distributed learning materials including Teach Me to Smile and An Easy Bite. Teachers and school health workers reinforced these lessons with follow-up activities.",
      "Early behavior change has compounding effects. Students share what they learn at home, caregivers become more informed, and communities gain stronger awareness of preventive health practices.",
    ],
  },
  {
    slug: "from-policy-briefs-to-public-action",
    title: "From Policy Briefs to Public Action",
    excerpt:
      "Turning evidence into advocacy through clear communication, stakeholder alignment, and local ownership.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    category: "Policy",
    date: "March 8, 2026",
    author: "Research and Policy Team",
    readMinutes: "8 min read",
    content: [
      "Policy briefs are most effective when they simplify complexity without losing rigor. They should answer three questions clearly: what is the issue, what evidence supports change, and what practical step should decision-makers take next.",
      "At CREAP, briefs are co-developed with program insights so recommendations reflect field realities. This approach helps bridge research and implementation while improving the odds of adoption by stakeholders.",
      "Evidence alone is not enough. Uptake depends on clear framing, timely engagement, and trusted relationships that can move recommendations into measurable action.",
    ],
  },
];

export const BLOG_POSTS_BY_SLUG = BLOG_POSTS.reduce<Record<string, BlogPost>>((acc, post) => {
  acc[post.slug] = post;
  return acc;
}, {});
