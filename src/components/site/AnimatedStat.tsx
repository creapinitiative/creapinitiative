import { useEffect, useRef, useState } from "react";

function parseStat(raw: string) {
  const match = raw.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: raw };
  return { target: parseInt(match[1].replace(/,/g, ""), 10), prefix: "", suffix: match[2] };
}

export function AnimatedStat({ value }: { value: string }) {
  const { target, suffix } = parseStat(value);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 900;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </div>
  );
}
