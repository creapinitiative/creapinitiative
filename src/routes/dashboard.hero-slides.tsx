import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Download, ImageOff } from "lucide-react";
import type { HeroSlide } from "@/api/collections";
import {
  listHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  removeHeroSlide,
  setHeroSlideActive,
  reorderHeroSlides,
  loadDefaultHeroSlides,
} from "@/api/collections-api";
import { HeroSlideEditor, type SlideValues } from "@/components/dashboard/HeroSlideEditor";

export const Route = createFileRoute("/dashboard/hero-slides")({
  loader: () => listHeroSlides(),
  component: HeroSlidesPage,
});

const NO_SLIDES: HeroSlide[] = [];

function HeroSlidesPage() {
  const router = useRouter();
  const loaded = (Route.useLoaderData() ?? NO_SLIDES) as HeroSlide[];
  // Local copy so reordering and toggling feel instant; re-synced after every server round-trip.
  const [slides, setSlides] = useState<HeroSlide[]>(loaded);
  const [editing, setEditing] = useState<HeroSlide | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setSlides(loaded), [loaded]);

  const visibleCount = slides.filter((s) => s.active).length;

  async function run(action: () => Promise<unknown>, fallback: HeroSlide[] = loaded) {
    setBusy(true);
    setError(null);
    try {
      await action();
      await router.invalidate();
    } catch (err) {
      setSlides(fallback);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
    void run(() => reorderHeroSlides({ data: { ids: next.map((s) => s.id) } }));
  }

  function toggle(slide: HeroSlide) {
    setSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, active: !s.active } : s)));
    void run(() => setHeroSlideActive({ data: { id: slide.id, active: !slide.active } }));
  }

  function remove(slide: HeroSlide) {
    if (!window.confirm(`Delete the slide "${slide.title}"? This can't be undone.`)) return;
    setSlides((prev) => prev.filter((s) => s.id !== slide.id));
    void run(() => removeHeroSlide({ data: { id: slide.id } }));
  }

  async function save(values: SlideValues) {
    if (editing === "new") await createHeroSlide({ data: values });
    else if (editing) await updateHeroSlide({ data: { id: editing.id, data: values } });
    await router.invalidate();
    setEditing(null);
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink">Homepage Slides</h1>
          <p className="text-ink3 mt-1 text-sm sm:text-base">
            The big rotating banner at the top of the homepage. Slides play in the order below.
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition shrink-0"
        >
          <Plus size={14} /> Add slide
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {slides.length === 0 ? (
        <div className="bg-white border border-rule rounded-sm p-8 text-center">
          <p className="font-display text-xl text-ink mb-2">Your homepage is showing the built-in slides</p>
          <p className="text-ink3 text-sm max-w-md mx-auto mb-6">
            Load the current slides to edit, reorder or hide them, or start fresh with your own. As soon as you have
            one slide here, only the slides in this list are shown.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              disabled={busy}
              onClick={() => void run(() => loadDefaultHeroSlides())}
              className="inline-flex items-center gap-2 border border-g600 text-g700 hover:bg-g50 disabled:opacity-60 text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition"
            >
              <Download size={14} /> Load the current slides
            </button>
            <button
              onClick={() => setEditing("new")}
              className="inline-flex items-center gap-2 bg-g600 hover:bg-g700 text-white text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm transition"
            >
              <Plus size={14} /> Create my first slide
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-ink4 mb-3">
            {slides.length} slide{slides.length === 1 ? "" : "s"} · {visibleCount} visible on the homepage
            {visibleCount === 0 && " — with none visible, the built-in slides are shown instead"}
          </p>
          <ol className="space-y-3">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className={[
                  "bg-white border border-rule rounded-sm p-3 sm:p-4 flex flex-wrap sm:flex-nowrap items-center gap-4 transition",
                  slide.active ? "" : "opacity-60",
                ].join(" ")}
              >
                <div className="flex sm:flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={busy || index === 0}
                    className="p-1 text-ink3 hover:text-ink disabled:opacity-25"
                    aria-label="Move up"
                    title="Move up"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <span className="text-xs font-semibold text-ink4 w-5 text-center">{index + 1}</span>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={busy || index === slides.length - 1}
                    className="p-1 text-ink3 hover:text-ink disabled:opacity-25"
                    aria-label="Move down"
                    title="Move down"
                  >
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="w-36 sm:w-44 aspect-[16/9] rounded-sm overflow-hidden border border-rule bg-g50 shrink-0 grid place-items-center">
                  {slide.image_url ? (
                    <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={18} className="text-ink4" />
                  )}
                </div>

                <div className="min-w-0 flex-1 basis-48">
                  {slide.eyebrow && <p className="text-[10px] uppercase tracking-[0.14em] text-gold font-semibold mb-0.5">{slide.eyebrow}</p>}
                  <p className="font-medium text-ink leading-snug">
                    {slide.title}
                    {slide.highlight && <span className="text-gold italic"> {slide.highlight}</span>}
                  </p>
                  <p className="text-xs text-ink4 mt-1 truncate">
                    {[slide.cta1_label, slide.cta2_label].filter(Boolean).join(" · ") || "No buttons"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <button
                    onClick={() => toggle(slide)}
                    disabled={busy}
                    className={[
                      "inline-flex items-center gap-1.5 px-3 py-2 border rounded-sm text-[11px] font-semibold uppercase tracking-wide transition",
                      slide.active ? "border-g500 text-g700 bg-g50" : "border-rule text-ink3",
                    ].join(" ")}
                    aria-label={slide.active ? "Hide this slide" : "Show this slide"}
                    title={slide.active ? "Visible — click to hide" : "Hidden — click to show"}
                  >
                    {slide.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    {slide.active ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => setEditing(slide)}
                    className="p-2 border border-rule hover:border-g500 rounded-sm text-ink2 transition"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(slide)}
                    disabled={busy}
                    className="p-2 border border-rule hover:border-red-400 hover:text-red-600 rounded-sm text-ink2 disabled:opacity-50 transition"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      {editing && (
        <HeroSlideEditor
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}
