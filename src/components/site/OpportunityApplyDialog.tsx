import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useFormSubmit } from "@/lib/use-form-submit";
import { OPPORTUNITY_CATEGORY } from "@/lib/opportunity-categories";
import type { Opportunity } from "@/api/collections";

const inputClass =
  "w-full border border-rule rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition";

export function OpportunityApplyDialog({ opportunity, onClose }: { opportunity: Opportunity; onClose: () => void }) {
  const { status, error, handleSubmit } = useFormSubmit(
    `Thank you — your application for ${opportunity.title} was received.`,
  );
  const isCoordinator = opportunity.category === "state-coordinator";

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
          {OPPORTUNITY_CATEGORY[opportunity.category]?.label ?? opportunity.category}
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
              state: fd.get("state") ?? "",
              cvLink: fd.get("cvLink"),
              message: fd.get("message"),
            }))
          }
        >
          <input name="fullName" required placeholder="Full name" className={inputClass} />
          <input name="email" type="email" required placeholder="Email address" className={inputClass} />
          <input name="phone" type="tel" required placeholder="Phone number" className={inputClass} />
          {isCoordinator && <input name="state" required placeholder="State of residence" className={inputClass} />}
          <div>
            <input
              name="cvLink"
              type="url"
              placeholder={isCoordinator ? "Link to your CV (optional)" : "Link to your CV (Google Drive, Dropbox…)"}
              className={inputClass}
            />
            <p className="text-xs text-ink4 mt-1">Make sure the link is set to “anyone with the link can view”.</p>
          </div>
          <textarea
            name="message"
            rows={4}
            required={isCoordinator}
            placeholder={
              isCoordinator
                ? "Why do you want to coordinate CREAP in your state?"
                : "Tell us briefly why you're a great fit"
            }
            className={inputClass}
          />
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
