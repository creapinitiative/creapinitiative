import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { UPCOMING_PROGRAMS } from "@/lib/upcoming-programs";

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
  component: UpcomingProgramsPage,
});

function UpcomingProgramsPage() {
  const { location } = useRouterState();

  if (location.pathname !== "/programs/upcoming-programs") {
    return <Outlet />;
  }

  return (
    <>
      <PageHero
        eyebrow="Home / Programs / Upcoming Programs"
        title="Upcoming Programs"
        body="Explore upcoming opportunities, workshops, and trainings designed to strengthen civic leadership and community impact."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-16 lg:px-28 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {UPCOMING_PROGRAMS.map((program) => (
            <article
              key={program.slug}
              className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_18px_30px_rgba(10,26,15,0.12)] transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  loading="lazy"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute top-4 left-4 bg-gold text-g900 text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm">
                  Upcoming
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

                <Link
                  to="/programs/upcoming-programs/$slug"
                  params={{ slug: program.slug }}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] font-semibold text-g700 hover:text-g500"
                >
                  View Program <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
