import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { leadershipApi } from "@/api/collections-api";
import type { LeadershipEntry } from "@/api/collections";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — CREAP Africa Initiative" },
      { name: "description", content: "Meet the executive leadership, management team and state coordinators driving CREAP Africa Initiative." },
    ],
  }),
  loader: () => leadershipApi.list(),
  component: Leadership,
});

function Card({ name, role, photo_url }: LeadershipEntry) {
  return (
    <article className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold transition">
      <div className="aspect-[4/5] bg-gradient-to-br from-g100 to-g50 grid place-items-center overflow-hidden">
        {photo_url ? (
          <img src={photo_url} alt={name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="font-display text-7xl text-g300 group-hover:text-gold transition">
            {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl">{name}</h3>
        <p className="text-[12px] tracking-[0.16em] uppercase text-gold font-semibold mt-1.5">{role}</p>
      </div>
    </article>
  );
}

function Leadership() {
  const all = Route.useLoaderData() ?? [];
  const executive = all.filter((m) => m.team === "executive");
  const management = all.filter((m) => m.team === "management");
  const state = all.filter((m) => m.team === "state");

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title={<>The people behind <em className="italic text-goldf">CREAP</em></>}
        body="An executive team, management specialists and state coordinators united by community, rights and sustainable development."
      />

      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Executive Leadership</p>
          <h2 className="display-lg mb-12">Governance & <em className="text-gold italic">stewardship</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executive.map((m, idx) => (
              <RevealItem key={m.id} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-24 bg-g50 border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">Management Team</p>
          <h2 className="display-lg mb-12">Day-to-day <em className="text-gold italic">leadership</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {management.map((m, idx) => (
              <RevealItem key={m.id} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="py-24 bg-bg border-t border-rule">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <p className="eyebrow-dark mb-4">State Level Team</p>
          <h2 className="display-lg mb-12">Leading our work <em className="text-gold italic">on the ground</em></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {state.map((m, idx) => (
              <RevealItem key={m.id} as="div" index={idx}>
                <Card {...m} />
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-g700 text-white py-20">
        <Reveal as="div" className="mx-auto max-w-[1100px] px-5 sm:px-8 md:px-12 lg:px-28 text-center">
          <p className="eyebrow mb-4">Join Us</p>
          <h2 className="display-md text-white mb-5">
            Become a <em className="italic text-goldf">State Coordinator</em>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Help lead our work in your state — coordinating outreaches, partnerships and research engagement on the ground.
          </p>
          <Link to="/get-involved" className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 uppercase tracking-wider text-xs font-semibold px-8 py-4 rounded-sm transition">
            Apply Now
          </Link>
        </Reveal>
      </section>
    </>
  );
}
