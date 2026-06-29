import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Linkedin } from "lucide-react";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — CREAP Africa Initiative" },
      { name: "description", content: "Meet the board of trustees, management team and state coordinators driving CREAP Africa Initiative." },
    ],
  }),
  component: Leadership,
});

const BOARD = [
  { name: "Dr. A. Adekunle", role: "Board Chair", bio: "Public policy researcher with two decades in governance reform." },
  { name: "Mrs. F. Onyema", role: "Vice Chair", bio: "Development economist focused on rural women's livelihoods." },
  { name: "Mr. K. Bello", role: "Trustee", bio: "Environmental lawyer specialising in climate finance." },
];
const MGMT = [
  { name: "J. Okafor", role: "Executive Director" },
  { name: "S. Ibrahim", role: "Programs Lead" },
  { name: "C. Eze", role: "Research & Policy" },
  { name: "M. Yusuf", role: "Operations" },
];

function Card({ name, role, bio }: { name: string; role: string; bio?: string }) {
  return (
    <article className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold transition">
      <div className="aspect-[4/5] bg-gradient-to-br from-g100 to-g50 grid place-items-center">
        <span className="font-display text-7xl text-g300 group-hover:text-gold transition">
          {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl">{name}</h3>
        <p className="text-[12px] tracking-[0.16em] uppercase text-gold font-semibold mt-1.5">{role}</p>
        {bio && <p className="text-sm text-ink3 mt-3 leading-relaxed">{bio}</p>}
        <a href="#" className="inline-flex items-center gap-2 mt-4 text-[12px] uppercase tracking-wider text-ink3 hover:text-gold transition">
          <Linkedin size={13} /> Profile
        </a>
      </div>
    </article>
  );
}

function Leadership() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title={<>The people behind <em className="italic text-goldf">CREAP</em></>}
        body="A board of trustees, management team and state coordinators united by community, rights and sustainable development."
      />

      <section className="py-24 bg-bg">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <p className="eyebrow-dark mb-4">Board of Trustees</p>
          <h2 className="display-lg mb-12">Governance & <em className="text-gold italic">stewardship</em></h2>
          <div className="grid md:grid-cols-3 gap-7">
            {BOARD.map((m) => <Card key={m.name} {...m} />)}
          </div>
        </div>
      </section>

      <section className="py-24 bg-g50 border-t border-rule">
        <div className="mx-auto max-w-[1300px] px-6 lg:px-10">
          <p className="eyebrow-dark mb-4">Management Team</p>
          <h2 className="display-lg mb-12">Day-to-day <em className="text-gold italic">leadership</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MGMT.map((m) => <Card key={m.name} {...m} />)}
          </div>
        </div>
      </section>

      <section className="bg-g700 text-white py-20">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-10 text-center">
          <p className="eyebrow mb-4">State Teams</p>
          <h2 className="display-md text-white mb-5">
            Become a <em className="italic text-goldf">State Coordinator</em>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Help lead our work in your state — coordinating outreaches, partnerships and research engagement on the ground.
          </p>
          <Link to="/get-involved" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-8 py-4 rounded-sm transition">
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
