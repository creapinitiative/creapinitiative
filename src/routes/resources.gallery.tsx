import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";

import oh01 from "@/assets/gallery/oral-health-campaign-01.jpg";
import oh02 from "@/assets/gallery/oral-health-campaign-02.jpg";
import oh03 from "@/assets/gallery/oral-health-campaign-03.jpg";
import oh04 from "@/assets/gallery/oral-health-campaign-04.jpg";
import oh05 from "@/assets/gallery/oral-health-campaign-05.jpg";
import oh06 from "@/assets/gallery/oral-health-campaign-06.jpg";
import oh07 from "@/assets/gallery/oral-health-campaign-07.jpg";
import oh08 from "@/assets/gallery/oral-health-campaign-08.jpg";
import oh09 from "@/assets/gallery/oral-health-campaign-09.jpg";
import oh10 from "@/assets/gallery/oral-health-campaign-10.jpg";
import oh11 from "@/assets/gallery/oral-health-campaign-11.jpg";
import oh12 from "@/assets/gallery/oral-health-campaign-12.jpg";
import oh13 from "@/assets/gallery/oral-health-campaign-13.jpg";
import oh14 from "@/assets/gallery/oral-health-campaign-14.jpg";
import oh15 from "@/assets/gallery/oral-health-campaign-15.jpg";
import oh16 from "@/assets/gallery/oral-health-campaign-16.jpg";
import oh17 from "@/assets/gallery/oral-health-campaign-17.jpg";
import oh18 from "@/assets/gallery/oral-health-campaign-18.jpg";
import oh19 from "@/assets/gallery/oral-health-campaign-19.jpg";
import oh20 from "@/assets/gallery/oral-health-campaign-20.jpg";
import oh21 from "@/assets/gallery/oral-health-campaign-21.jpg";
import oh22 from "@/assets/gallery/oral-health-campaign-22.jpg";
import oh23 from "@/assets/gallery/oral-health-campaign-23.jpg";
import oh24 from "@/assets/gallery/oral-health-campaign-24.jpg";

import rm01 from "@/assets/gallery/radio-maria-01.jpg";
import rm02 from "@/assets/gallery/radio-maria-02.jpg";
import rm03 from "@/assets/gallery/radio-maria-03.jpg";
import rm04 from "@/assets/gallery/radio-maria-04.jpg";
import rm05 from "@/assets/gallery/radio-maria-05.jpg";
import rm06 from "@/assets/gallery/radio-maria-06.jpg";
import rm07 from "@/assets/gallery/radio-maria-07.jpg";
import rm08 from "@/assets/gallery/radio-maria-08.jpg";
import rm09 from "@/assets/gallery/radio-maria-09.jpg";
import rm10 from "@/assets/gallery/radio-maria-10.jpg";

import sarcs from "@/assets/gallery/sarcs-conference.jpg";
import days16 from "@/assets/gallery/16-days-activism.jpg";

export const Route = createFileRoute("/resources/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — CREAP Africa Initiative" },
      { name: "description", content: "Photo highlights from CREAP programs, outreaches, workshops, and community events." },
    ],
  }),
  component: GalleryPage,
});

const GALLERY_ITEMS = [
  { image: oh20, caption: "CREAP staff and school officials hold up the Oral Health in Schools campaign banner", tall: false },
  { image: oh01, caption: "Students and teachers rally behind the Oral Health in Schools campaign banner", tall: false },
  { image: oh13, caption: "The wider school community poses with the campaign banner", tall: false },
  { image: oh07, caption: "Facilitators review outreach materials ahead of the school session", tall: true },
  { image: oh04, caption: "Learners hold up oral hygiene awareness flyers with the CREAP team", tall: false },
  { image: oh18, caption: "A pupil addresses the school on healthy oral hygiene habits", tall: false },
  { image: oh06, caption: "Pupils celebrate their new toothbrushes at the campaign send-off", tall: false },
  { image: oh24, caption: "A pupil, teacher and CREAP staff member share the hygiene flyer", tall: true },
  { image: oh02, caption: "The school community gathers for the oral health awareness campaign", tall: false },
  { image: oh09, caption: "Facilitators brief the class using the campaign's roll-up banner", tall: false },
  { image: oh12, caption: "Excited pupils wave their new toothbrushes", tall: false },
  { image: oh15, caption: "A pupil and teacher share the oral hygiene flyer", tall: false },
  { image: oh22, caption: "The team poses together with the oral health campaign banner", tall: false },
  { image: oh10, caption: "Pupils and teachers display their oral hygiene flyers", tall: false },
  { image: oh19, caption: "A candid moment as the team celebrates a successful outreach", tall: false },
  { image: oh03, caption: "Pupils and staff pose together at the campaign banner", tall: false },
  { image: oh16, caption: "Close-up with the 'Naflax is Smiling Bright' hygiene flyer", tall: true },
  { image: oh14, caption: "Pupils raise their toothbrushes in celebration", tall: false },
  { image: oh05, caption: "Pupils and facilitators share the 'Naflax is Smiling Bright' hygiene flyer", tall: false },
  { image: oh23, caption: "The pupil continues the oral health talk before the campaign banner", tall: false },
  { image: oh08, caption: "A pre-outreach briefing session at the school", tall: false },
  { image: oh11, caption: "More learners join the flyer distribution exercise", tall: false },
  { image: oh17, caption: "Another cheerful toothbrush celebration moment", tall: false },
  { image: oh21, caption: "The full campaign banner, detailing the Gosa Junior Secondary School outreach", tall: false },
  { image: rm01, caption: "On air at Radio Maria 91.3FM, Abuja", tall: true },
  { image: rm03, caption: "The CREAP team with the Radio Maria FM banner", tall: false },
  { image: rm07, caption: "The panel discussion continues in the studio", tall: false },
  { image: rm02, caption: "Discussing CREAP's work live on Radio Maria", tall: true },
  { image: rm06, caption: "Roundtable discussion in the Radio Maria studio", tall: false },
  { image: rm10, caption: "The team celebrates after the broadcast", tall: true },
  { image: rm04, caption: "Team photo after the on-air segment", tall: false },
  { image: rm09, caption: "A wider view of the studio roundtable", tall: false },
  { image: rm05, caption: "Another group photo at the Radio Maria studio", tall: false },
  { image: rm08, caption: "Guests in conversation on air", tall: false },
  { image: sarcs, caption: "Representing CREAP at the 11th Network Conference of Sexual Assault Referral Centers (SARCs)", tall: true },
  { image: days16, caption: "Marking the 16 Days of Activism Against Sexual & Gender-Based Violence", tall: false },
];

function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev === null ? prev : (prev + 1) % GALLERY_ITEMS.length));
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? prev : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Gallery"
        title="Gallery"
        body="A visual record of our work across communities, schools, and policy spaces."
      />

      <section className="bg-bg py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, index) => {
              return (
                <figure
                  key={`${item.caption}-${index}`}
                  className="rounded-sm overflow-hidden border border-rule bg-white group"
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="w-full text-left"
                    aria-label={`Open image: ${item.caption}`}
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      loading={index < 3 ? "eager" : "lazy"}
                      className={[
                        "w-full object-cover group-hover:scale-[1.02] transition duration-500",
                        item.tall ? "h-[420px]" : "h-[300px]",
                      ].join(" ")}
                    />
                  </button>
                  <figcaption className="px-4 py-3 text-ink3">{item.caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </Reveal>
      </section>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm px-4 py-8 md:p-10"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <div className="mx-auto h-full max-w-[1200px] flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(null);
              }}
              className="absolute top-6 right-6 text-white/90 hover:text-white text-sm uppercase tracking-[0.12em]"
            >
              Close
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === null ? prev : (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length));
              }}
              className="absolute left-4 md:left-8 text-white/85 hover:text-white text-3xl leading-none"
              aria-label="Previous image"
            >
              ‹
            </button>

            <figure
              className="max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_ITEMS[activeIndex].image}
                alt={GALLERY_ITEMS[activeIndex].caption}
                className="max-h-[78vh] w-auto max-w-[92vw] object-contain rounded-sm"
              />
              <figcaption className="text-white/80 mt-3 text-center">
                {GALLERY_ITEMS[activeIndex].caption}
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === null ? prev : (prev + 1) % GALLERY_ITEMS.length));
              }}
              className="absolute right-4 md:right-8 text-white/85 hover:text-white text-3xl leading-none"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
