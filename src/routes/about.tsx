import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import aboutImg from "@/assets/about-team.jpg";
import { Target, Compass, Heart, Award, Globe, Users2, BookOpen, Sprout } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CREAP — Our Story, Vision & Mission" },
      { name: "description", content: "Founded in October 2021, CREAP Africa Initiative champions equity, access and sustainability for marginalized communities across Nigeria and Africa." },
    ],
  }),
  component: About,
});

const DRIVERS = [
  { icon: Target, title: "Rights-Based Approach", body: "We anchor all programs in human rights principles and the dignity of every individual." },
  { icon: Globe, title: "Community Ownership", body: "Solutions are co-designed with the communities they serve, ensuring lasting local impact." },
  { icon: BookOpen, title: "Evidence & Research", body: "Policy briefs, field data and lived experience shape every intervention we deliver." },
  { icon: Sprout, title: "Sustainability", body: "We work for outcomes that outlast us — institutional, environmental and economic." },
  { icon: Users2, title: "Inclusion", body: "Women, youth, persons with disabilities and rural populations are central, not afterthoughts." },
  { icon: Compass, title: "Integrity", body: "Transparent governance, accountable spending and honest reporting at every level." },
  { icon: Heart, title: "People-Centred", body: "We design with empathy and dignity — listening before prescribing." },
  { icon: Award, title: "Excellence", body: "Programs are measured against rigorous standards and external review." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About CREAP"
        title={<>Building <em className="italic text-goldf">people-centred</em>, sustainable change across Africa</>}
        body="Formed in October 2021 and registered in July 2024 under the Companies and Allied Matters Act, 2020. We champion innovative platforms, tools and community-driven approaches that advance bold advocacy, empowerment, and leadership."
      />

      {/* Our Story */}
      <section className="py-24 lg:py-32 bg-bg">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10 grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2">
            <p className="eyebrow-dark mb-4">Our Story</p>
            <h2 className="display-lg">
              From a small idea to a <em className="text-gold italic">growing movement</em>
            </h2>
          </div>
          <div className="lg:col-span-3 space-y-6 text-ink2 text-lg leading-relaxed">
            <p>
              CREAP Africa Initiative began with a simple conviction: development must be driven by the communities it claims to serve. From our first civic education sessions in Abuja to nationwide outreach and research engagement today, we have stayed grounded in that belief.
            </p>
            <p className="text-ink3 text-base">
              Across five focus areas — climate, governance, youth, health and peacebuilding — we work alongside schools, faith institutions, women's groups and policymakers to bring evidence and lived experience into the same room. The result is policy that listens and programs that endure.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Dark Panel */}
      <section className="bg-g700 text-white py-24 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 grid md:grid-cols-2 gap-12">
          <div className="border-l-2 border-gold pl-8">
            <p className="eyebrow mb-4">Vision</p>
            <h3 className="display-md text-white mb-5">
              Inclusive, resilient and <em className="text-goldf italic">empowered communities</em>
            </h3>
            <p className="text-white/75 leading-relaxed">
              Communities where rights are protected, opportunities are accessible to all, and sustainable development thrives.
            </p>
          </div>
          <div className="border-l-2 border-gold pl-8">
            <p className="eyebrow mb-4">Mission</p>
            <h3 className="display-md text-white mb-5">
              People-centred, rights-based <em className="text-goldf italic">development solutions</em>
            </h3>
            <p className="text-white/75 leading-relaxed">
              Empowering marginalized and underserved communities through advocacy, knowledge-sharing, skills development and leadership strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Key Drivers */}
      <section className="bg-g50 py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow-dark mb-4">What Drives Us</p>
            <h2 className="display-lg">
              Principles that <em className="text-gold italic">shape every program</em>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DRIVERS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-rule p-7 rounded-sm hover:border-gold transition">
                <Icon size={26} strokeWidth={1.5} className="text-gold mb-5" />
                <h4 className="font-display text-xl mb-2.5">{title}</h4>
                <p className="text-sm text-ink3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg py-20 border-t border-rule">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
          <h3 className="display-md mb-6">Ready to learn how we work?</h3>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            <Link to="/programs" className="bg-g600 hover:bg-g700 text-white uppercase tracking-wider text-xs font-semibold px-7 py-3.5 rounded-sm transition">Explore Programs</Link>
            <Link to="/leadership" className="border border-rule hover:border-g500 text-g700 uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition">Meet the Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
