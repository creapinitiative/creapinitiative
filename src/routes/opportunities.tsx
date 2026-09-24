import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { useFormSubmit } from "@/lib/use-form-submit";
import { opportunitiesApi } from "@/api/collections-api";
import type { Opportunity } from "@/api/collections";
import { Briefcase, GraduationCap, Users2, HeartHandshake, X, AlertCircle, type LucideIcon } from "lucide-react";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — Careers, Internships & Fellowships | CREAP" },
      { name: "description", content: "Open roles, internships, fellowships and volunteer calls at CREAP Africa Initiative." },
    ],
  }),
  // Show the empty state rather than an error page if the table isn't there yet.
  loader: () => opportunitiesApi.list().catch(() => [] as Opportunity[]),
  component: Opportunities,
});

const CATEGORY: Record<Opportunity["category"], { label: string; icon: LucideIcon }> = {
  "full-time": { label: "Full-time", icon: Briefcase },
  fellowship: { label: "Fellowship", icon: GraduationCap },
  internship: { label: "Internship", icon: Users2 },
  volunteer: { label: "Volunteer", icon: HeartHandshake },
};

const inputClass =
  "w-full border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition";

function ApplyDialog({ opportunity, onClose }: { opportunity: Opportunity; onClose: () => void }) {
  const { status, error, handleSubmit } = useFormSubmit(
    `Thank you — your application for ${opportunity.title} was received.`,
  );

  useEffect(() => {
    if (status === "success") onClose();
  }, [status, onClose]);

  return (
    <div className="fixed inset-0 z-[150] grid place-items-center bg-black/50 px-4 py-8 overflow-y-auto" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${opportunity.title}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-sm p-7 sm:p-9 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-ink3 hover:text-ink" aria-label="Close" title="Close">
          <X size={20} />
        </button>
        <p className="text-[11px] tracking-[0.16em] uppercase font-semibold text-gold mb-1">
          {CATEGORY[opportunity.category]?.label ?? opportunity.category}
        </p>
        <h2 className="font-display text-2xl leading-tight mb-1">{opportunity.title}</h2>
        <p className="text-sm text-ink3 mb-6">{opportunity.location} · Apply by {opportunity.deadline}</p>

        <form
          className="space-y-3"
          onSubmit={(e) =>
            handleSubmit(e, (fd) => ({
              formType: "opportunity",
              opportunityId: opportunity.id,
              opportunityTitle: opportunity.title,
              opportunityCategory: opportunity.category,
              fullName: fd.get("fullName"),
              email: fd.get("email"),
              phone: fd.get("phone"),
              cvLink: fd.get("cvLink"),
              message: fd.get("message"),
            }))
          }
        >
          <input name="fullName" required placeholder="Full name" className={inputClass} />
          <input name="email" type="email" required placeholder="Email address" className={inputClass} />
          <input name="phone" type="tel" required placeholder="Phone number" className={inputClass} />
          <div>
            <input name="cvLink" type="url" placeholder="Link to your CV (Google Drive, Dropbox…)" className={inputClass} />
            <p className="text-xs text-ink4 mt-1">Make sure the link is set to “anyone with the link can view”.</p>
          </div>
          <textarea name="message" rows={4} placeholder="Tell us briefly why you're a great fit" className={inputClass} />
          <button
            disabled={status === "submitting"}
            className="w-full bg-g600 hover:bg-g700 disabled:opacity-60 text-white uppercase tracking-wider text-xs font-semibold py-4 rounded-sm transition"
          >
            {status === "submitting" ? "Submitting…" : "Submit application"}
          </button>
          {status === "error" && (
            <p className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} /> {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function Opportunities() {
  const openings = Route.useLoaderData() ?? [];
  const [applying, setApplying] = useState<Opportunity | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Opportunities"
        title={<>Build your career on <em className="italic text-goldf">purpose</em></>}
        body="Join a team committed to dignified work, rigorous standards, and meaningful change."
      />

      <section className="py-24 bg-bg">
        <Reveal as="div" className="mx-auto max-w-[1100px] px-5 sm:px-8 md:px-12 lg:px-28 space-y-4">
          {openings.length === 0 && (
            <p className="text-ink3 text-center py-16">No open opportunities right now — please check back soon.</p>
          )}
          {openings.map((job, idx) => {
            const { label, icon: Icon } = CATEGORY[job.category] ?? CATEGORY["full-time"];
            return (
              <RevealItem key={job.id} as="article" index={idx} className="bg-white border border-rule rounded-sm p-7 lg:p-8 grid md:grid-cols-12 gap-6 items-center hover:border-gold transition">
                <div className="md:col-span-1"><Icon size={28} strokeWidth={1.5} className="text-gold" /></div>
                <div className="md:col-span-7">
                  <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-gold">{label}</span>
                  <h3 className="font-display text-2xl mt-1">{job.title}</h3>
                  <p className="text-sm text-ink3 mt-1">{job.location} · Apply by {job.deadline}</p>
                  {job.description && <p className="text-ink3 mt-2 leading-relaxed">{job.description}</p>}
                </div>
                <div className="md:col-span-4 md:text-right">
                  <button
                    onClick={() => setApplying(job)}
                    className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white uppercase tracking-wider text-xs font-semibold px-6 py-3 rounded-sm transition"
                  >
                    Apply
                  </button>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </section>

      {applying && <ApplyDialog opportunity={applying} onClose={() => setApplying(null)} />}
    </>
  );
}
