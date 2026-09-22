import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { policyBriefsApi } from "@/api/collections-api";
import { tryGetSupabaseAdmin } from "@/api/supabase-admin";
import { Download, FileText } from "lucide-react";

const debugLoad = createServerFn({ method: "GET" }).handler(async () => {
  const viaFactory = await policyBriefsApi.list();
  const supabase = tryGetSupabaseAdmin();
  let raw: unknown = null;
  let rawError: string | null = null;
  if (supabase) {
    const res = await supabase.from("policy_briefs").select("*");
    raw = res.data;
    rawError = res.error?.message ?? null;
  }
  return {
    briefs: viaFactory,
    debug: {
      viaFactoryType: typeof viaFactory,
      viaFactoryIsArray: Array.isArray(viaFactory),
      viaFactoryLength: Array.isArray(viaFactory) ? viaFactory.length : null,
      supabaseConfigured: !!supabase,
      rawLength: Array.isArray(raw) ? raw.length : null,
      rawError,
    },
  };
});

export const Route = createFileRoute("/resources/policy-briefs")({
  head: () => ({
    meta: [
      { title: "Policy Briefs — CREAP Africa Initiative" },
      { name: "description", content: "Policy briefs and research publications from CREAP Africa Initiative." },
    ],
  }),
  loader: () => debugLoad(),
  component: PolicyBriefsPage,
});

function PolicyBriefsPage() {
  const result = Route.useLoaderData();
  const briefs = result?.briefs ?? [];

  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Policy Briefs"
        title="Policy Briefs"
        body="Research-informed recommendations to guide better policy and stronger community outcomes."
      />

      <pre style={{ background: "black", color: "lime", padding: 16, fontSize: 12, whiteSpace: "pre-wrap" }}>
        DEBUG: {JSON.stringify(result?.debug, null, 2)}
      </pre>

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {briefs.length === 0 && (
            <p className="text-ink3 text-center py-16">No policy briefs published yet.</p>
          )}
          {briefs.map((brief, idx) => (
            <RevealItem
              key={brief.id}
              as="article"
              index={idx}
              className="group flex flex-col md:flex-row md:items-center gap-6 bg-white border border-rule rounded-sm p-7 hover:border-gold transition"
            >
              <div className="w-14 h-14 rounded-sm bg-g100 text-g500 grid place-items-center shrink-0 group-hover:bg-g600 group-hover:text-white transition">
                <FileText size={24} strokeWidth={1.6} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-2">Policy Brief · {brief.date}</p>
                <h2 className="font-display text-3xl leading-tight mb-2">{brief.title}</h2>
                <p className="text-ink3 leading-relaxed">{brief.body}</p>
              </div>
              {brief.file_url && (
                <a
                  href={brief.file_url}
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
