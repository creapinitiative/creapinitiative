import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { upcomingProgramsApi } from "@/api/collections-api";

export const Route = createFileRoute("/programs/upcoming-programs")({
  head: () => ({
    meta: [
      { title: "Upcoming Programs - CREAP Africa Initiative" },
      {
        name: "description",
        content:
          "Discover upcoming CREAP Africa Initiative programs, training opportunities, and civic engagement events.",
      },
    ],
  }),
  loader: () => upcomingProgramsApi.list(),
  component: UpcomingProgramsPage,
});

function isPastEvent(endDate?: string | null): boolean {
  if (!endDate) return false;
  return endDate < new Date().toISOString().slice(0, 10);
}

function ProgramCard({ program, idx }: { program: ReturnType<typeof Route.useLoaderData>[number]; idx: number }) {
  const past = isPastEvent(program.event_end_date);
  return (
    <RevealItem
      as="article"
      index={idx}
      className={[
        "group bg-white border border-rule rounded-sm overflow-hidden transition-all",
        past ? "opacity-80" : "hover:border-gold hover:shadow-[0_18px_30px_rgba(10,26,15,0.12)]",
      ].join(" ")}
    >
      <Link
        to="/programs/upcoming-programs/$slug"
        params={{ slug: program.slug }}
        className="block h-full"
      >
        <div className="relative overflow-hidden">
          <img
            src={program.image_url ?? undefined}
            alt={program.title}
            loading="lazy"
            className={[
              "w-full h-64 object-cover bg-g100 transition-transform duration-500",
              past ? "grayscale-[35%]" : "group-hover:scale-105",
            ].join(" ")}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
          <span
            className={[
              "absolute top-4 left-4 text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm",
              past ? "bg-ink4 text-white" : "bg-gold text-g900",
            ].join(" ")}
          >
            {past ? "Past" : "Upcoming"}
          </span>
        </div>

        <div className="p-6 flex flex-col">
          <h2 className="font-display text-3xl leading-tight mb-2">{program.subtitle}</h2>
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
  );
}

function UpcomingProgramsPage() {
  const { location } = useRouterState();
  const programs = Route.useLoaderData() ?? [];

  if (location.pathname !== "/programs/upcoming-programs") {
    return <Outlet />;
  }

  const upcoming = programs.filter((p) => !isPastEvent(p.event_end_date));
  const past = programs.filter((p) => isPastEvent(p.event_end_date));

  return (
    <>
      <PageHero
        eyebrow="Home / Programs / Upcoming Programs"
        title="Upcoming Programs"
        body="Explore upcoming opportunities, workshops, and trainings designed to strengthen civic leadership and community impact."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 lg:px-28 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {upcoming.length === 0 && (
            <p className="text-ink3 text-center py-16 md:col-span-2 xl:col-span-3">
              No upcoming programs right now — check back shortly
              {past.length > 0 && (
                <>
                  {" "}
                  or{" "}
                  <a href="#past-programs-archive" className="font-semibold text-g700 hover:text-g500 underline underline-offset-2">
                    view past programs
                  </a>
                </>
              )}
              .
            </p>
          )}
          {upcoming.map((program, idx) => (
            <ProgramCard key={program.slug} program={program} idx={idx} />
          ))}
        </Reveal>

        {past.length > 0 && (
          <div id="past-programs-archive" className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 lg:px-28 mt-16 scroll-mt-24">
            <h2 className="font-display text-2xl text-ink mb-2">Past Programs Archive</h2>
            <p className="text-ink3 mb-8">A record of programs and events we've already delivered.</p>
            <Reveal as="div" className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {past.map((program, idx) => (
                <ProgramCard key={program.slug} program={program} idx={idx} />
              ))}
            </Reveal>
          </div>
        )}
      </section>
    </>
  );
}
