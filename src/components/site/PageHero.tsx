import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
}) {
  const reduce = useReducedMotion();

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
      <motion.div
        className="relative mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-28"
        initial={reduce ? undefined : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="display-xl text-white max-w-4xl">{title}</h1>
        {body && <p className="mt-7 max-w-2xl text-lg text-white/70 leading-relaxed">{body}</p>}
      </motion.div>
    </section>
  );
}
