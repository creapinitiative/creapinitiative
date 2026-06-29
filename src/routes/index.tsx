import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Leaf, Scale, Users, FileText, Download } from "lucide-react";
import { HeroSlider } from "@/components/site/HeroSlider";
import aboutImg from "@/assets/about-team.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CREAP Africa Initiative — Equity, Access & Sustainability" },
      { name: "description", content: "Championing equity, access, and sustainability across Nigeria and Africa through advocacy, civic education, climate action and youth empowerment." },
      { property: "og:title", content: "CREAP Africa Initiative" },
      { property: "og:description", content: "Championing equity, access, and sustainability across Nigeria and Africa." },
    ],
  }),
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
  { value: "28,200+", label: "People Reached", desc: "Individuals engaged through outreaches, campaigns & capacity-building" },
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
    title: "Balancing Innovation and Caution in the Quest for Food Security",
    body: "Evidence-based pathways to agricultural innovation that maintain ecological integrity.",
  },
  {
    tag: "Report",
    title: "Climate-Smart Agriculture & AI for Sustainable Food Systems in Nigeria",
    body: "Documents implementation of climate-smart agriculture leveraging AI tools.",
  },
];

function Home() {
  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. CREAP Acronym Band */}
      <section className="relative bg-g900 text-white">
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-5">
          {ACRONYM.map((a) => (
            <div
              key={a.letter}
              className="group relative px-6 lg:px-8 py-14 lg:py-16 border-r border-white/[0.06] last:border-r-0 odd:border-b md:odd:border-b-0 transition-colors hover:bg-[rgba(184,148,31,0.04)]"
            >
              <span className={`block font-display font-light leading-none text-[clamp(3.5rem,6vw,6rem)] mb-5 ${a.gold ? "text-gold3" : "text-white/15"}`}>
                {a.letter}
              </span>
              <h3 className="font-display text-xl text-white mb-2.5">{a.word}</h3>
              <p className="text-[13px] text-white/55 leading-relaxed font-light">{a.desc}</p>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-7 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] tracking-[0.24em] uppercase text-white/45">
              Community · Rights · Education · Advancement · Pathway · Initiative
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-[12px] tracking-wider uppercase text-gold3 hover:text-goldf transition">
              Discover our story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Statistics Band */}
      <section className="bg-g800 text-white py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <p className="eyebrow mb-4">Key Impacts</p>
            <h2 className="display-lg text-white">
              Measuring Change, <em className="text-goldf italic">Scaling Impact</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
            {STATS.map((s) => (
              <div key={s.label} className="border-t border-white/12 pt-7">
                <p className="font-display text-[clamp(2.5rem,4.5vw,4rem)] text-gold3 font-medium leading-none">
                  {s.value}
                </p>
                <h3 className="font-display text-lg text-white mt-4 mb-2">{s.label}</h3>
                <p className="text-[13px] text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who We Are */}
      <section className="bg-bg py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            <img src={aboutImg} alt="CREAP Africa Initiative team" className="w-full h-[520px] object-cover rounded-sm shadow-lg" loading="lazy" />
            <div className="absolute -bottom-6 -right-6 bg-g700 text-white p-7 max-w-[260px] rounded-sm hidden md:block">
              <p className="font-display text-3xl text-gold3 leading-none">2021</p>
              <p className="text-[13px] text-white/70 mt-2">Founded · Registered under CAMA 2020 in July 2024</p>
            </div>
          </div>

          <div>
            <p className="eyebrow-dark mb-4">Who We Are</p>
            <h2 className="display-lg mb-7">
              Championing Equity, Access & <em className="text-gold italic">Sustainability</em>
            </h2>
            <p className="text-ink2 text-lg leading-relaxed mb-5">
              CREAP Africa Initiative champions innovative platforms, tools, and community-driven approaches that advance bold advocacy, empowerment, and leadership strategies.
            </p>
            <p className="text-ink3 leading-relaxed mb-8">
              Our work cuts across critical social and environmental issues, driving sustainable solutions for people and communities across Nigeria and Africa.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="border-l-2 border-gold pl-5">
                <h4 className="font-display text-xl mb-2">Vision</h4>
                <p className="text-sm text-ink3 leading-relaxed">
                  Inclusive, resilient and empowered communities where rights are protected, opportunities are accessible, and sustainable development thrives.
                </p>
              </div>
              <div className="border-l-2 border-gold pl-5">
                <h4 className="font-display text-xl mb-2">Mission</h4>
                <p className="text-sm text-ink3 leading-relaxed">
                  Empowering marginalized and underserved communities through people-centred, rights-based, and sustainable development solutions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white font-semibold uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition hover:-translate-y-0.5">
                About CREAP <ArrowRight size={14} />
              </Link>
              <Link to="/leadership" className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-g700 uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Three Thematic Areas */}
      <section className="bg-g50 py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow-dark mb-4">Our Focus Areas</p>
            <h2 className="display-lg">
              Three Themes, <em className="text-gold italic">One Purpose</em>
            </h2>
            <p className="mt-5 text-ink3">
              Three interconnected themes guide our work toward holistic, sustainable community development across Nigeria and Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {THEMES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="group bg-white border border-rule p-9 rounded-sm hover:border-gold hover:shadow-lg transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 grid place-items-center bg-g100 text-g500 group-hover:bg-g500 group-hover:text-white rounded-sm mb-6 transition-colors">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl leading-tight mb-4">{title}</h3>
                <p className="text-sm text-ink3 leading-relaxed mb-6">{body}</p>
                <Link to="/programs" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g500 transition">
                  Learn more <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Publications */}
      <section className="bg-bg py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
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

          <div className="grid md:grid-cols-3 gap-7">
            {PUBS.map((p) => (
              <article key={p.title} className="group bg-white border border-rule rounded-sm overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-g100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={72} strokeWidth={1} className="text-g300 group-hover:text-gold transition-colors duration-500" />
                  </div>
                  <span className="absolute top-4 left-4 bg-goldb text-g700 text-[10px] tracking-[0.16em] uppercase font-semibold px-2.5 py-1 rounded-sm">
                    {p.tag}
                  </span>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="font-display text-xl leading-tight mb-3 flex-1">{p.title}</h3>
                  <p className="text-sm text-ink3 leading-relaxed mb-5">{p.body}</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-gold hover:text-g600 transition">
                    View PDF <Download size={13} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Social follow band */}
      <section className="bg-g50 border-t border-rule py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 text-center">
          <p className="eyebrow-dark mb-4">Follow Our Journey</p>
          <h2 className="display-md max-w-2xl mx-auto">
            Stay updated with our latest <em className="text-gold italic">community stories</em>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {[
              ["Facebook", "https://www.facebook.com/share/1ESwRFSCuT/"],
              ["LinkedIn", "https://www.linkedin.com/company/creap-africa-initiative/"],
              ["Instagram", "https://www.instagram.com/creapafricainitiative"],
              ["Twitter / X", "https://x.com/creapafrica"],
              ["YouTube", "https://youtube.com/@creapafricainitiative"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-rule hover:border-gold hover:bg-white text-sm tracking-wide text-ink3 hover:text-g700 rounded-sm transition"
              >
                @creapinitiative · {l}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
