import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import slideEvidence from "@/assets/evidence-driven-policy.jpg";
import slideEquity from "@/assets/equity-for-marginalized.jpg";
import slideGovernance from "@/assets/civic-participation.jpg";
import slideClimate from "@/assets/greening-futures.jpeg";
import slidePeace from "@/assets/championing-peace.jpg";
import slideCapacity from "@/assets/empowering-people-through-knowledge.jpg";
import slidePartnership from "@/assets/stronger-together-through-collaboration.jpg";

const SLIDES = [
  {
    img: slideEvidence,
    eyebrow: "Evidence & Research",
    title: <>Evidence-Driven Policy, <em className="text-goldf italic">Lasting Impact</em></>,
    body: "We use research, data and community-generated evidence to inform policies and programs that create real, measurable change.",
    cta1: { label: "About CREAP", to: "/about" },
    cta2: { label: "Our Publications", to: "/resources/policy-briefs" },
  },
  {
    img: slideEquity,
    eyebrow: "Equity & Inclusion",
    title: <>Equity for the Marginalized, <em className="text-goldf italic">Access for All</em></>,
    body: "We pursue policies and systems that ensure access to opportunities, resources, and services for the marginalized and underserved.",
    cta1: { label: "Discover CREAP", to: "/about" },
    cta2: { label: "Get Involved", to: "/get-involved" },
  },
  {
    img: slideGovernance,
    eyebrow: "Governance & Democracy",
    title: <>Civic Participation, <em className="text-goldf italic">Accountable Governance</em></>,
    body: "We promote civic participation and public accountability so communities can influence decisions that shape their lives.",
    cta1: { label: "Our Programs", to: "/programs/our-key-programs" },
    cta2: { label: "Read Reports", to: "/resources/policy-briefs" },
  },
  {
    img: slideClimate,
    eyebrow: "Climate & Environment",
    title: <>Greening Futures, <em className="text-goldf italic">Building Climate Resilience</em></>,
    body: "We advance environmentally responsible development, climate adaptation, and sustainable livelihoods that protect ecosystems and communities.",
    cta1: { label: "Our Programs", to: "/programs/our-key-programs" },
    cta2: { label: "Get Involved", to: "/get-involved" },
  },
  {
    img: slidePeace,
    eyebrow: "Peace & Youth Empowerment",
    title: <>Championing Peace, <em className="text-goldf italic">Youth Empowerment & Civic Life</em></>,
    body: "We work constantly to promote Peace, Civic Education and Youth Empowerment, recognizing that development cannot thrive without social cohesion.",
    cta1: { label: "About CREAP", to: "/about" },
    cta2: { label: "View Programs", to: "/programs/our-key-programs" },
  },
  {
    img: slideCapacity,
    eyebrow: "Capacity & Empowerment",
    title: <>Empowering People Through <em className="text-goldf italic">Knowledge & Skills</em></>,
    body: "We invest in digital skills, leadership training, and capacity development - building a generation equipped to drive sustainable change.",
    cta1: { label: "Get Involved", to: "/get-involved" },
    cta2: { label: "Our Programs", to: "/programs/our-key-programs" },
  },
  {
    img: slidePartnership,
    eyebrow: "Partnerships & Collaboration",
    title: <>Stronger Together Through <em className="text-goldf italic">Strategic Collaboration</em></>,
    body: "Our work is powered by collaboration with strategic public and private institutions - building synergies that amplify community impact.",
    cta1: { label: "Partner With Us", to: "/get-involved" },
    cta2: { label: "About CREAP", to: "/about" },
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
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
          <div className="absolute inset-0 flex items-center lg:items-end">
            <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-20 lg:pb-28">
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
        className="absolute left-3 lg:left-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 grid place-items-center bg-white/8 hover:bg-white/15 backdrop-blur text-white rounded-sm border border-white/15 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => go(i + 1)}
        className="absolute right-3 lg:right-10 top-1/2 -translate-y-1/2 z-20 w-8 h-8 lg:w-10 lg:h-10 grid place-items-center bg-white/8 hover:bg-white/15 backdrop-blur text-white rounded-sm border border-white/15 transition"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
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
