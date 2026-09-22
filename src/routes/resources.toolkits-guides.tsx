import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { toolkitsGuidesApi } from "@/api/collections-api";
import { Download, BookOpenCheck } from "lucide-react";

export const Route = createFileRoute("/resources/toolkits-guides")({
  head: () => ({
    meta: [
      { title: "Toolkits & Guides — CREAP Africa Initiative" },
      { name: "description", content: "Practical toolkits and guides from CREAP Africa Initiative." },
    ],
  }),
  loader: () => toolkitsGuidesApi.list(),
  component: ToolkitsGuidesPage,
});

function ToolkitsGuidesPage() {
  const items = Route.useLoaderData() ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Knowledge Hub / Toolkits & Guides"
        title="Toolkits & Guides"
        body="Practical, field-tested toolkits and guides to support civic educators, community leaders and partner organisations."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {items.length === 0 && (
            <p className="text-ink3 text-center py-16">No toolkits or guides published yet.</p>
          )}
          {items.map((item, idx) => (
            <RevealItem
              key={item.id}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <BookOpenCheck size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Toolkit / Guide · {item.date}</p>
                <h2 className="font-display text-3xl leading-tight mb-2">{item.title}</h2>
                <p className="text-ink3 leading-relaxed">{item.description}</p>
              </div>
              {item.file_url && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
                >
                  Download <Download size={13} />
                </a>
              )}
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
