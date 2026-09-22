import { motion, useReducedMotion } from "framer-motion";
import type { JSX, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  span: motion.span,
  a: motion.a,
  li: motion.li,
  ul: motion.ul,
  p: motion.p,
  figure: motion.figure,
  h2: motion.h2,
  h3: motion.h3,
} as const;

type TagName = keyof typeof TAGS;

type RevealOwnProps<T extends TagName> = {
  children: ReactNode;
  as?: T;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
};

type RevealProps<T extends TagName> = RevealOwnProps<T> &
  Omit<JSX.IntrinsicElements[T], "children" | keyof RevealOwnProps<T>>;

/** Fades and slides an element up into place the first time it scrolls into view. */
export function Reveal<T extends TagName = "div">(props: RevealProps<T>) {
  const { children, as, delay = 0, y = 28, duration = 0.7, once = true, ...rest } = props as RevealOwnProps<T> &
    Record<string, unknown>;
  const reduce = useReducedMotion();
  const tagName = (as ?? "div") as TagName;
  const MotionTag = TAGS[tagName];

  if (reduce) {
    const Plain = tagName as unknown as "div";
    return (
      <Plain {...(rest as React.ComponentPropsWithoutRef<"div">)}>
        {children}
      </Plain>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </MotionTag>
  );
}

/** Same as Reveal, but derives a small incremental delay from `index` — for staggering cards in a grid/list. */
export function RevealItem<T extends TagName = "div">(
  props: RevealProps<T> & { index?: number; step?: number; maxDelay?: number },
) {
  const { index = 0, step = 0.08, maxDelay = 0.48, delay, ...rest } = props as RevealOwnProps<T> &
    Record<string, unknown> & { index?: number; step?: number; maxDelay?: number };
  const computed = delay ?? Math.min((index ?? 0) * (step ?? 0.08), maxDelay ?? 0.48);
  return <Reveal delay={computed} {...(rest as RevealProps<T>)} />;
}
