import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { KEY_PROGRAMS } from "@/lib/key-programs";

export const Route = createFileRoute("/programs/our-key-programs/$slug")({
  head: ({ params }) => {
    const program = KEY_PROGRAMS.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: `${program?.title ?? "Program"} — CREAP Africa Initiative` },
        { name: "description", content: program?.body ?? "CREAP Africa Initiative programs." },
      ],
    };
  },
  component: KeyProgramDetailPage,
});

function KeyProgramDetailPage() {
  const { slug } = Route.useParams();
  const program = KEY_PROGRAMS.find((p) => p.slug === slug);

  if (!program || !program.detail) {
    return (
      <section className="min-h-[70vh] grid place-items-center bg-bg px-6 pt-44 pb-24">
        <div className="max-w-xl text-center">
          <p className="eyebrow-dark mb-4">Program Not Found</p>
          <h1 className="display-md mb-4">This program page doesn't exist</h1>
          <Link
            to="/programs/our-key-programs"
            className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
          >
            <ArrowLeft size={14} /> Back to Our Key Programs
          </Link>
        </div>
      </section>
    );
  }

  const { detail } = program;

  return (
    <article className="bg-bg pt-[150px] lg:pt-[190px] pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1040px] px-5 sm:px-8 md:px-12 lg:px-28">
        <Link
          to="/programs/our-key-programs"
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-g700 hover:text-g500 mb-7"
        >
          <ArrowLeft size={14} /> Back to Our Key Programs
        </Link>

        <p className="eyebrow-dark mb-4">Key Program</p>
        <h1 className="display-lg mb-8">{program.title}</h1>

        <img
          src={detail.heroImage}
          alt=""
          className="w-full aspect-[16/9] object-cover rounded-sm border border-rule mb-10"
        />

        <Reveal as="div" className="space-y-5 text-lg text-ink2 leading-relaxed max-w-4xl">
          {detail.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <section className="mt-16 space-y-8">
          <p className="eyebrow-dark">The Platforms</p>
          {detail.platforms.map((platform, idx) => (
            <RevealItem
              key={platform.title}
              as="article"
              index={idx}
              className="grid gap-6 md:grid-cols-[1fr_1.2fr] items-center bg-white border border-rule rounded-sm p-5 md:p-7"
            >
              <img src={platform.image} alt="" loading="lazy" className="w-full aspect-[16/9] object-cover rounded-sm" />
              <div>
                <p className="text-[11px] tracking-[0.16em] uppercase text-gold font-semibold mb-2">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display text-3xl leading-tight mb-3">{platform.title}</h2>
                <p className="text-ink3 leading-relaxed">{platform.body}</p>
              </div>
            </RevealItem>
          ))}
        </section>

        <Reveal as="section" className="mt-16 rounded-sm border border-rule bg-white p-7 md:p-9">
          <p className="text-ink2 leading-relaxed text-lg">{detail.closing}</p>
        </Reveal>
      </div>
    </article>
  );
}
