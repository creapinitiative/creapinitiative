import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Scale, Users, FileText, Download, CalendarDays, MapPin, SunMedium, Shield } from "lucide-react";
import { HeroSlider } from "@/components/site/HeroSlider";
import { AnimatedStat } from "@/components/site/AnimatedStat";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { upcomingProgramsApi } from "@/api/collections-api";
import logoFmoyd from "@/assets/partners/federal-ministry-of-youth-development.jpg";
import logoIpcr from "@/assets/partners/ipcr.jpg";
import logoNoa from "@/assets/partners/noa.jpg";
import logoCivicus from "@/assets/partners/civicus.jpg";

const PARTNERS = [
  { name: "Federal Ministry of Youth Development", logo: logoFmoyd },
  { name: "Institute for Peace and Conflict Resolution", logo: logoIpcr },
  { name: "National Orientation Agency", logo: logoNoa },
  { name: "CIVICUS", logo: logoCivicus },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CREAP Africa Initiative — Equity, Access & Sustainability" },
      { name: "description", content: "Championing equity, access, and sustainability across Nigeria and Africa through advocacy, civic education, climate action and youth empowerment." },
      { property: "og:title", content: "CREAP Africa Initiative" },
      { property: "og:description", content: "Championing equity, access, and sustainability across Nigeria and Africa." },
    ],
  }),
  loader: () => upcomingProgramsApi.list(),
  component: Home,
});

const ACRONYM = [
  { letter: "C", word: "Community", desc: "Rooted in grassroots communities across Africa", gold: true },
  { letter: "R", word: "Rights", desc: "Advancing rights-based, people-centered approaches" },
  { letter: "E", word: "Education", desc: "Building knowledge that transforms lives and communities", gold: true },
  { letter: "A", word: "Advancement", desc: "Driving forward sustainable, inclusive development" },
  { letter: "P", word: "Pathway", desc: "Creating pathways to equity, access, and opportunity", gold: true },
];

const STATS = [
  { value: "48,700+", label: "People Reached", desc: "Individuals engaged through outreaches, campaigns & capacity-building" },
  { value: "28+", label: "Schools & Communities", desc: "Benefiting from trainings, research engagements & development initiatives" },
  { value: "27", label: "Major Programs", desc: "Covering peacebuilding, civic education, climate action & more" },
  { value: "22", label: "Publications", desc: "Policy briefs, research reports, toolkits & articles" },
];

const THEMES = [
  {
    icon: Leaf,
    title: "Climate Change and Environmental Sustainability",
    body: "We promote climate action and environmental stewardship through adaptation and mitigation initiatives that strengthen community resilience and protect natural ecosystems.",
  },
  {
    icon: Scale,
    title: "Peacebuilding and Democratic Governance",
    body: "We advance peaceful and inclusive societies by promoting democratic values, active citizen participation, accountable leadership, and transparent governance.",
  },
  {
    icon: Users,
    title: "Youth Empowerment and Inclusive Development",
    body: "We empower young people and marginalized communities with knowledge, skills, and platforms to participate meaningfully in social and economic development.",
  },
];

const PUBS = [
  {
    tag: "Policy Brief",
    title: "Promoting Peace and Security in the Face of Emerging Global Threats",
    body: "Examining peacebuilding strategies in the context of evolving global security challenges.",
  },
  {
    tag: "Policy Brief",
    title: "Balancing Innovation and Caution in Our Quest for Food Security",
    body: "Evidence-based pathways to agricultural innovation that maintain ecological integrity.",
    file: "/reports/policy-brief-food-security-2025.pdf",
  },
  {
    tag: "Report",
    title: "Climate-Smart Agriculture & AI for Sustainable Food Systems in Nigeria",
    body: "Documents implementation of climate-smart agriculture leveraging AI tools.",
  },
];

function isPastEvent(endDate?: string | null): boolean {
  if (!endDate) return false;
  return endDate < new Date().toISOString().slice(0, 10);
}

function Home() {
  const ALL_PROGRAMS = Route.useLoaderData() ?? [];
  const UPCOMING_PROGRAMS = ALL_PROGRAMS.filter((p) => !isPastEvent(p.event_end_date));
  const HAS_PAST_PROGRAMS = ALL_PROGRAMS.some((p) => isPastEvent(p.event_end_date));

  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. CREAP Acronym Band */}
      <section className="relative bg-g900 text-white">
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-5">
          {ACRONYM.map((a, idx) => (
            <RevealItem
              key={a.letter}
              as="div"
              index={idx}
              y={20}
              className="group relative px-6 lg:px-8 py-14 lg:py-16 border-r border-white/[0.06] last:border-r-0 odd:border-b md:odd:border-b-0 transition-colors hover:bg-[rgba(184,148,31,0.04)]"
            >
              <span className={`block font-display font-light leading-none text-[clamp(3.5rem,6vw,6rem)] mb-5 ${a.gold ? "text-gold3" : "text-white/15"}`}>
                {a.letter}
              </span>
              <h3 className="font-display text-xl text-white mb-2.5">{a.word}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed font-light">{a.desc}</p>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </RevealItem>
          ))}
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 py-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] tracking-[0.24em] uppercase text-white/45">
              Community · Rights · Education · Advancement · Pathway · Initiative
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-[12px] tracking-wider uppercase text-gold3 hover:text-goldf transition">
              Discover our story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Who We Are */}
      <section className="bg-bg py-20 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 grid lg:grid-cols-[1.04fr_0.96fr] gap-12 lg:gap-14 items-start">
          <div className="pt-4 lg:pt-8 max-w-[640px]">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="h-[2px] w-9 bg-gold" aria-hidden="true" />
              <p className="eyebrow-dark">Who We Are</p>
            </div>

            <h2 className="display-lg mb-8 max-w-[620px]">
              Championing Equity, Access
              <br />
              & <em className="text-g500 italic">Sustainability</em>
            </h2>

            <p className="text-ink3 leading-relaxed mb-8 max-w-[600px]">
              CREAP Africa Initiative champions innovative platforms, tools, and community-driven approaches that advance bold advocacy, empowerment, and leadership strategies.
              Formed in October 2021 and registered in July 2024 under the Companies and Allied Matters Act, 2020.
            </p>

            <p className="text-ink3 leading-relaxed mb-12 max-w-[600px]">
              Our work cuts across critical social and environmental issues, driving sustainable solutions for people and communities across Nigeria and Africa.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white font-semibold uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition hover:-translate-y-0.5">
                About CREAP <ArrowRight size={14} />
              </Link>
              <Link to="/leadership" className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-g700 uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition">
                Meet the Team
              </Link>
            </div>
          </div>

          <div className="grid gap-1.5">
            <article className="rounded-sm bg-g900 text-white p-8 lg:p-10">
              <div className="w-14 h-14 rounded-sm bg-g700/70 text-gold3 grid place-items-center mb-6">
                <SunMedium size={20} strokeWidth={1.8} />
              </div>
              <p className="eyebrow text-gold3 mb-5">Vision</p>
              <p className="leading-relaxed text-white/95 max-w-[42ch]">
                Inclusive, resilient and empowered communities where rights are protected, opportunities are accessible, and sustainable development thrives.
              </p>
            </article>

            <article className="rounded-sm bg-gold text-g900 p-8 lg:p-10">
              <div className="w-14 h-14 rounded-sm bg-[#c39c1c] text-g900 grid place-items-center mb-6">
                <Shield size={20} strokeWidth={1.9} />
              </div>
              <p className="eyebrow-dark text-g700 mb-5">Mission</p>
              <p className="leading-relaxed text-g900 max-w-[42ch]">
                Empowering marginalised and underserved communities by advancing people-centred, right-based, and sustainable development solutions in advocacy, knowledge-sharing, skills development and leadership strategies.
              </p>
            </article>
          </div>
        </Reveal>
      </section>

      {/* 4. Three Thematic Areas */}
      <section className="bg-g50 py-20 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="eyebrow-dark mb-4">Our Focus Areas</p>
            <h2 className="display-lg">
              Three Themes, <em className="text-gold italic">One Purpose</em>
            </h2>
            <p className="mt-5 text-ink3">
              Three interconnected themes guide our work toward holistic, sustainable community development across Nigeria and Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 rounded-sm overflow-hidden bg-white shadow-[0_12px_28px_rgba(10,26,15,0.08)]">
            {THEMES.map(({ icon: Icon, title, body }, idx) => (
              <RevealItem
                key={title}
                as="article"
                index={idx}
                className="slide-border-top-smooth group bg-white p-8 lg:p-9 border-r border-rule last:border-r-0 transition-all duration-300"
              >
                <div className="w-12 h-12 grid place-items-center bg-g100 text-g500 group-hover:bg-g500 group-hover:text-white rounded-sm mb-5 transition-colors">
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-[31px] leading-tight mb-4">{title}</h3>
                <p className="text-ink3 leading-relaxed mb-6">{body}</p>
                <Link to="/programs" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g500 transition">
                  Learn more <ArrowRight size={13} />
                </Link>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5. Statistics Band */}
      <section className="bg-bg py-20 lg:py-24 border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow-dark mb-4">Opportunities</p>
              <h2 className="display-lg max-w-2xl">
                Upcoming <em className="text-gold italic">Programs</em>
              </h2>
              <p className="mt-4 text-ink3 max-w-2xl">
                Register for upcoming workshops, training opportunities, and civic leadership programs.
              </p>
            </div>
            <Link to="/programs/upcoming-programs" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g500 transition">
              View All Upcoming Programs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {UPCOMING_PROGRAMS.length === 0 && (
              <p className="text-ink3 md:col-span-2 xl:col-span-3">
                No upcoming programs right now — check back shortly
                {HAS_PAST_PROGRAMS && (
                  <>
                    {" "}
                    or{" "}
                    <Link
                      to="/programs/upcoming-programs"
                      hash="past-programs-archive"
                      className="font-semibold text-g700 hover:text-g500 underline underline-offset-2"
                    >
                      view past programs
                    </Link>
                  </>
                )}
                .
              </p>
            )}
            {UPCOMING_PROGRAMS.map((program, idx) => (
              <RevealItem
                key={program.slug}
                as="article"
                index={idx}
                className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_18px_30px_rgba(10,26,15,0.12)] transition-all"
              >
                <Link
                  to="/programs/upcoming-programs/$slug"
                  params={{ slug: program.slug }}
                  className="block h-full"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={program.image_url ?? undefined}
                      alt={program.subtitle}
                      loading="lazy"
                      className="w-full h-64 object-cover bg-g100 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                    <span className="absolute top-4 left-4 bg-gold text-g900 text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm">
                      Upcoming
                    </span>
                  </div>

                  <div className="p-6 flex flex-col">
                    <h3 className="font-display text-3xl leading-tight mb-2">{program.subtitle}</h3>
                    <p className="text-sm font-medium text-ink2 leading-relaxed mb-3">{program.theme}</p>
                    <p className="text-ink3 leading-relaxed mb-5">{program.summary}</p>

                    <div className="space-y-2 text-sm text-ink3 mb-6">
                      <p className="inline-flex items-center gap-2">
                        <CalendarDays size={15} className="text-g500" />
                        {program.date}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <MapPin size={15} className="text-g500" />
                        {program.venue}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] font-semibold text-g700 group-hover:text-g500">
                      View Program <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-g800 text-white py-20 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="max-w-3xl mb-14">
            <p className="eyebrow mb-4">Key Impacts</p>
            <h2 className="display-lg text-white">
              Measuring Change, <em className="text-goldf italic">Scaling Impact</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {STATS.map((s, idx) => (
              <RevealItem key={s.label} as="div" index={idx} className="border-t border-white/12 pt-7">
                <div className="font-display text-[clamp(2.5rem,4.5vw,4rem)] text-gold3 font-medium leading-none">
                  <AnimatedStat value={s.value} />
                </div>
                <h3 className="font-display text-lg text-white mt-4 mb-2">{s.label}</h3>
                <p className="text-white/55 leading-relaxed">{s.desc}</p>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 6. Publications */}
      <section className="bg-bg py-20 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow-dark mb-4">Knowledge Products</p>
              <h2 className="display-lg max-w-xl">
                Policy Briefs & <em className="text-gold italic">Reports</em>
              </h2>
            </div>
            <Link to="/resources" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g500 transition">
              All Publications <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-0 rounded-sm overflow-hidden bg-white shadow-[0_12px_26px_rgba(10,26,15,0.08)]">
            {PUBS.map((p, idx) => (
              <RevealItem key={p.title} as="article" index={idx} className="slide-border-top-smooth group bg-white overflow-hidden flex flex-col border-r border-rule last:border-r-0">
                <div className="aspect-[4/3] bg-g100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={72} strokeWidth={1} className="text-g300 group-hover:text-gold transition-colors duration-500" />
                  </div>
                  <span className="absolute top-4 left-4 bg-goldb text-g700 text-[10px] tracking-[0.18em] uppercase font-semibold px-2.5 py-1 rounded-sm">
                    {p.tag}
                  </span>
                </div>
                <div className="p-6 lg:p-7 flex-1 flex flex-col">
                  <h3 className="font-display text-[30px] leading-tight mb-3 flex-1">{p.title}</h3>
                  <p className="text-ink3 leading-relaxed mb-5">{p.body}</p>
                  <a
                    href={p.file ?? "#"}
                    download={Boolean(p.file)}
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g600 transition"
                  >
                    View PDF <Download size={13} />
                  </a>
                </div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 7. Partners */}
      <section className="bg-bg py-16 lg:py-20 border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1200px] px-5 sm:px-8 md:px-12 lg:px-28 text-center">
          <p className="eyebrow-dark mb-10">Our Partners</p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
            {PARTNERS.map((partner, idx) => (
              <RevealItem
                key={partner.name}
                as="div"
                index={idx}
                step={0.06}
                className="group"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  title={partner.name}
                  className="h-16 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 8. Social follow band */}
      <section className="bg-g50 border-t border-rule py-20">
        <Reveal as="div" className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28 text-center">
          <p className="eyebrow-dark mb-4">Follow Our Journey</p>
          <h2 className="display-lg max-w-2xl mx-auto">
            Stay updated with our latest <em className="text-gold italic">community stories</em>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {[
              ["Facebook", "https://www.facebook.com/share/16BhHZR317/"],
              ["Instagram", "https://www.instagram.com/creapafricainitiative"],
              ["LinkedIn", "https://www.linkedin.com/company/creap-africa-initiative/"],
              ["Twitter / X", "https://x.com/creapafrica"],
              ["TikTok", "https://vt.tiktok.com/ZS4HjMs5W/"],
              ["Threads", "https://www.threads.com/@creapafricainitiative"],
              ["YouTube", "https://youtube.com/@creapafricainitiative"],
            ].map(([l, h], idx) => (
              <RevealItem
                key={l}
                as="a"
                index={idx}
                step={0.05}
                y={12}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-rule hover:border-gold hover:bg-white text-sm tracking-wide text-ink3 hover:text-g700 rounded-sm transition"
              >
                @creapinitiative · {l}
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
