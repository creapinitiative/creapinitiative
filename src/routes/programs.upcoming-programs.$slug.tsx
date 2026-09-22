import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { getUpcomingProgramBySlug } from "@/api/collections-api";
import { Reveal, RevealItem } from "@/components/site/Reveal";

export const Route = createFileRoute("/programs/upcoming-programs/$slug")({
  loader: ({ params }) => getUpcomingProgramBySlug({ data: { slug: params.slug } }),
  component: UpcomingProgramDetailPage,
});

function isPastEvent(endDate?: string | null): boolean {
  if (!endDate) return false;
  return endDate < new Date().toISOString().slice(0, 10);
}

function UpcomingProgramDetailPage() {
  const program = Route.useLoaderData();

  if (!program) {
    return (
      <section className="min-h-[70vh] grid place-items-center bg-bg px-6 pt-44 pb-24">
        <div className="max-w-xl text-center">
          <p className="eyebrow-dark mb-4">Program Not Found</p>
          <h1 className="display-md mb-4">Upcoming Program Not Found</h1>
          <p className="text-ink3 mb-7">
            The program you are looking for does not exist or may have been moved.
          </p>
          <Link
            to="/programs/upcoming-programs"
            className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
          >
            <ArrowLeft size={14} /> Back to Upcoming Programs
          </Link>
        </div>
      </section>
    );
  }

  const audience: string[] = program.audience ?? [];
  const skills: string[] = program.skills ?? [];
  const hashtags: string[] = program.hashtags ?? [];

  return (
    <article className="bg-bg pt-[150px] lg:pt-[190px] pb-20 lg:pb-24">
      <div className="mx-auto max-w-[1040px] px-5 sm:px-8 md:px-12 lg:px-28">
        <Link
          to="/programs/upcoming-programs"
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-g700 hover:text-g500 mb-7"
        >
          <ArrowLeft size={14} /> Back to Upcoming Programs
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <p className="eyebrow-dark">{program.title}</p>
          {isPastEvent(program.event_end_date) && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm bg-ink4/15 text-ink3">
              Past Event
            </span>
          )}
        </div>
        <h1 className="display-lg mb-4">{program.subtitle}</h1>
        <p className="text-xl text-ink2 leading-relaxed mb-4 max-w-4xl">{program.theme}</p>
        <p className="text-lg text-ink3 leading-relaxed mb-8 max-w-4xl">{program.summary}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-ink3 mb-8">
          <p className="inline-flex items-center gap-2 rounded-sm border border-rule bg-white px-3 py-2">
            <CalendarDays size={15} className="text-g500" />
            {program.date}
          </p>
          <p className="inline-flex items-center gap-2 rounded-sm border border-rule bg-white px-3 py-2">
            <MapPin size={15} className="text-g500" />
            {program.venue}
          </p>
          {program.application_deadline && (
            <p className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-gold/10 px-3 py-2 text-g700">
              Application Deadline: {program.application_deadline}
            </p>
          )}
        </div>

        {program.image_url && (
          <img
            src={program.image_url}
            alt={program.subtitle}
            className="w-full h-[360px] md:h-[520px] object-cover rounded-sm border border-rule mb-10"
          />
        )}

        <section className="grid gap-8 lg:grid-cols-2">
          <RevealItem as="div" index={0} className="rounded-sm border border-rule bg-white p-7">
            <h2 className="font-display text-3xl mb-4">Who Can Apply</h2>
            <ul className="space-y-3 text-ink3">
              {audience.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-g500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem as="div" index={1} className="rounded-sm border border-rule bg-white p-7">
            <h2 className="font-display text-3xl mb-4">What You Will Learn</h2>
            <ul className="space-y-3 text-ink3">
              {skills.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-g500" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealItem>
        </section>

        <Reveal as="section" className="mt-8 rounded-sm border border-rule bg-white p-7">
          {program.closing_note && <p className="text-ink2 leading-relaxed mb-6">{program.closing_note}</p>}
          {program.partner_note ? (
            <p className="text-sm text-ink4 mb-6">{program.partner_note}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 mb-7">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-[0.08em] uppercase font-semibold px-2.5 py-1 rounded-sm bg-g100 text-g700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {program.apply_url && (
            <a
              href={program.apply_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] font-semibold px-5 py-2.5 rounded-sm bg-gold text-g900 hover:bg-gold2 transition"
            >
              Apply Now <ExternalLink size={14} />
            </a>
          )}
        </Reveal>
      </div>
    </article>
  );
}
