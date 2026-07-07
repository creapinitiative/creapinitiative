import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import aboutImg from "@/assets/about-team.jpg";
import heroCivic from "@/assets/hero-civic.jpg";
import heroHealth from "@/assets/hero-health.jpg";
import heroCommunity from "@/assets/hero-community.jpg";
import heroClimate from "@/assets/hero-climate.jpg";

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
  {
    image: heroCommunity,
    caption: "Community dialogue session",
    tall: true,
  },
  {
    image: heroCivic,
    caption: "Youth civic training workshop",
    tall: false,
  },
  {
    image: aboutImg,
    caption: "School engagement day",
    tall: true,
  },
  {
    image: heroClimate,
    caption: "Tree planting exercise",
    tall: false,
  },
  {
    image: heroHealth,
    caption: "Climate adaptation field visit",
    tall: false,
  },
  {
    image: aboutImg,
    caption: "Stakeholder policy roundtable",
    tall: true,
  },
  {
    image: heroCivic,
    caption: "Volunteer community outreach",
    tall: false,
  },
  {
    image: heroCommunity,
    caption: "Leadership mentorship cohort",
    tall: true,
  },
  {
    image: heroClimate,
    caption: "Local governance workshop",
    tall: false,
  },
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
        <div className="mx-auto max-w-[1300px] px-16 lg:px-28">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {GALLERY_ITEMS.map((item, index) => {
              return (
                <figure
                  key={`${item.caption}-${index}`}
                  className="mb-4 break-inside-avoid rounded-sm overflow-hidden border border-rule bg-white group"
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
        </div>
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
