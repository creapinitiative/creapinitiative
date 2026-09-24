import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { galleryImagesApi } from "@/api/collections-api";

export const Route = createFileRoute("/resources/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — CREAP Africa Initiative" },
      { name: "description", content: "Photo highlights from CREAP programs, outreaches, workshops, and community events." },
    ],
  }),
  loader: () => galleryImagesApi.list(),
  component: GalleryPage,
});

function GalleryPage() {
  const images = Route.useLoaderData() ?? [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((prev) => (prev === null ? prev : (prev + 1) % images.length));
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? prev : (prev - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length]);

  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Gallery"
        title="Gallery"
        body="A visual record of our work across communities, schools, and policy spaces."
      />

      <section className="bg-bg py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1300px] px-5 sm:px-8 md:px-12 lg:px-28">
          {images.length === 0 && (
            <p className="text-ink3 text-center py-16">No photos in the gallery yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((item, index) => {
              return (
                <figure
                  key={item.id}
                  className="rounded-sm overflow-hidden border border-rule bg-white group"
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="w-full text-left"
                    aria-label={`Open image: ${item.caption}`}
                  >
                    <img
                      src={item.image_url}
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
                setActiveIndex((prev) => (prev === null ? prev : (prev - 1 + images.length) % images.length));
              }}
              className="absolute left-4 md:left-8 text-white/85 hover:text-white text-3xl leading-none"
              aria-label="Previous image" title="Previous image"
            >
              ‹
            </button>

            <figure
              className="max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeIndex].image_url}
                alt={images[activeIndex].caption}
                className="max-h-[78vh] w-auto max-w-[92vw] object-contain rounded-sm"
              />
              <figcaption className="text-white/80 mt-3 text-center">
                {images[activeIndex].caption}
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => (prev === null ? prev : (prev + 1) % images.length));
              }}
              className="absolute right-4 md:right-8 text-white/85 hover:text-white text-3xl leading-none"
              aria-label="Next image" title="Next image"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
