import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "@/assets/hero-civic.jpg";
import slide2 from "@/assets/hero-health.jpg";
import slide3 from "@/assets/hero-community.jpg";
import slide4 from "@/assets/hero-climate.jpg";

const SLIDES = [
  {
    img: slide1,
    eyebrow: "Peace & Democracy",
    title: <>Civic Education & <em className="text-goldf italic">Democratic Awareness</em></>,
    body: "Mobilising citizens, youth, and communities to understand their rights and actively shape democratic processes across Nigeria.",
    cta1: { label: "Discover CREAP", to: "/about" },
    cta2: { label: "Our Programs", to: "/programs" },
  },
  {
    img: slide2,
    eyebrow: "Health & Wellbeing",
    title: <>Oral Health in Schools <em className="text-goldf italic">Campaign</em></>,
    body: "Empowering learners with knowledge and tools to build lifelong oral hygiene habits — through awareness, education, and community outreach.",
    cta1: { label: "View Programs", to: "/programs" },
    cta2: { label: "Read Report", to: "/resources" },
  },
  {
    img: slide3,
    eyebrow: "Community Outreach",
    title: <>Reaching Communities, <em className="text-goldf italic">Transforming Lives</em></>,
    body: "Through grassroots school outreaches and community engagement, CREAP is building a generation of informed, empowered, and resilient citizens.",
    cta1: { label: "About CREAP", to: "/about" },
    cta2: { label: "Get Involved", to: "/get-involved" },
  },
  {
    img: slide4,
    eyebrow: "Climate & Sustainability",
    title: <>Greening Communities for a <em className="text-goldf italic">Sustainable Future</em></>,
    body: "CREAP youth volunteers lead environmental clean-up and sustainability actions, turning climate justice into visible, community-level change.",
    cta1: { label: "Our Programs", to: "/programs" },
    cta2: { label: "View Reports", to: "/resources" },
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ${idx === i ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={s.img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${idx === i ? "animate-kenburns" : ""}`}
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(8,20,12,0.88) 0%, rgba(8,20,12,0.45) 55%, rgba(8,20,12,0.25) 100%)" }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-20 pb-24 lg:pb-28">
              <div
                key={`c-${idx}-${i}`}
                className={`max-w-[820px] ${idx === i ? "animate-fade-up" : "opacity-0"}`}
              >
                <p className="eyebrow text-gold3 mb-5">{s.eyebrow}</p>
                <h1 className="display-xl text-white">{s.title}</h1>
                <p className="mt-6 text-base sm:text-lg text-white/80 max-w-[620px] leading-relaxed font-light">
                  {s.body}
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to={s.cta1.to} className="inline-flex items-center gap-2 bg-gold hover:bg-gold2 text-g900 font-semibold uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(184,148,31,0.35)]">
                    {s.cta1.label} <ArrowRight size={14} />
                  </Link>
                  <Link to={s.cta2.to} className="inline-flex items-center gap-2 border border-white/45 text-white hover:border-white hover:bg-white/5 uppercase tracking-wider text-xs px-7 py-3.5 rounded-sm transition">
                    {s.cta2.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={() => go(i - 1)}
        className="absolute left-5 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 grid place-items-center bg-white/8 hover:bg-white/15 backdrop-blur text-white rounded-sm border border-white/15 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(i + 1)}
        className="absolute right-5 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 grid place-items-center bg-white/8 hover:bg-white/15 backdrop-blur text-white rounded-sm border border-white/15 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots + counter */}
      <div className="absolute bottom-10 right-10 z-20 hidden md:flex items-center gap-5 text-white/80">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              className={`h-[3px] transition-all ${idx === i ? "w-10 bg-gold" : "w-5 bg-white/30 hover:bg-white/50"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <p className="font-display text-base tracking-wider">
          <span className="text-gold3">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-white/40"> / {String(SLIDES.length).padStart(2, "0")}</span>
        </p>
      </div>
    </section>
  );
}
