import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { policyBriefsApi } from "@/api/collections-api";
import { Download } from "lucide-react";

// Fallback covers, used until a cover image is set for a brief in the dashboard.
const fallbackCovers = Object.entries(
  import.meta.glob("/src/assets/Policy Brief/*.{jpeg,jpg,png,webp}", { eager: true, import: "default" }),
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url as string);

export const Route = createFileRoute("/resources/policy-briefs")({
  head: () => ({
    meta: [
      { title: "Policy Briefs — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs and research publications from CREAP Africa Initiative." },
    ],
  }),
  loader: () => policyBriefsApi.list(),
  component: PolicyBriefsPage,
});

function PolicyBriefsPage() {
  const briefs = Route.useLoaderData() ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Policy Briefs"
        title="Policy Briefs"
        body="Research-informed recommendations to guide better policy and stronger community outcomes."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 ">
          {briefs.length === 0 && (
            <p className="text-ink3 text-center py-16">No policy briefs published yet.</p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((brief, idx) => {
              const cover = brief.image_url || fallbackCovers[idx % Math.max(fallbackCovers.length, 1)];
              return (
                <RevealItem
                  key={brief.id}
                  as="article"
                  index={idx}
                  className="group flex flex-col bg-white border border-rule rounded-sm overflow-hidden hover:border-gold transition"
                >
                  <div className="aspect-[4/3] bg-g100 overflow-hidden">
                    {cover && (
                      <img src={cover} alt={brief.title} loading="lazy" className="w-full h-full object-cover object-top" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Policy Brief · {brief.date}</p>
                    <h2 className="font-display text-2xl leading-tight mb-2">{brief.title}</h2>
                    <p className="text-ink3 leading-relaxed mb-5">{brief.body}</p>
                    {brief.file_url && (
                      <a
                        href={brief.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto self-start inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
                      >
                        Download <Download size={13} />
                      </a>
                    )}
                  </div>
                </RevealItem>
              );
            })}
          </div>
        </Reveal>
      </section>
    </>
  );
}
