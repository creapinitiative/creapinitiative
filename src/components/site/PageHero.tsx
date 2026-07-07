import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
}) {
  return (
    <section className="relative bg-g900 text-white pt-[180px] pb-24 lg:pt-[220px] lg:pb-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(184,148,31,0.18), transparent 60%), radial-gradient(ellipse at bottom right, rgba(45,90,61,0.4), transparent 55%)",
        }}
      />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
      <div className="relative mx-auto max-w-[1400px] px-16 lg:px-28">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="display-xl text-white max-w-4xl">{title}</h1>
        {body && <p className="mt-7 max-w-2xl text-lg text-white/70 leading-relaxed">{body}</p>}
      </div>
    </section>
  );
}
