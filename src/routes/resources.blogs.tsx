import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, RevealItem } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";
import { blogPostsApi } from "@/api/collections-api";

export const Route = createFileRoute("/resources/blogs")({
  head: () => ({
    meta: [
      { title: "Blogs — CREAP Africa Initiative" },
      { name: "description", content: "Stories, reflections, and updates from CREAP Africa Initiative projects and communities." },
    ],
  }),
  loader: () => blogPostsApi.list(),
  component: BlogsPage,
});

function BlogsPage() {
  const { location } = useRouterState();
  const posts = Route.useLoaderData() ?? [];

  if (location.pathname !== "/resources/blogs") {
    return <Outlet />;
  }

  return (
    <>
      <PageHero
        eyebrow="Home / Resources / Blogs"
        title="Blogs"
        body="Stories and insights from our programs, policy work, and community collaborations."
      />

      <section className="bg-g50 py-16 lg:py-24">
        <Reveal as="div" className="mx-auto max-w-[1320px] px-5 sm:px-8 md:px-12 lg:px-28 grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {posts.length === 0 && (
            <p className="text-ink3 text-center py-16 md:col-span-2 xl:col-span-3">No blog posts published yet.</p>
          )}
          {posts.map((post, idx) => (
            <RevealItem
              key={post.slug}
              as="article"
              index={idx}
              className="group bg-white border border-rule rounded-sm overflow-hidden hover:border-gold hover:shadow-[0_18px_30px_rgba(10,26,15,0.12)] transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image_url ?? undefined}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-64 object-cover bg-g100 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute top-4 left-4 bg-gold text-g900 text-[11px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex flex-col">
                <p className="text-[11px] tracking-[0.14em] uppercase text-ink4 mb-3">
                  {post.date} · {post.read_minutes}
                </p>
                <h2 className="font-display text-3xl leading-tight mb-3">{post.title}</h2>
                <p className="text-ink3 leading-relaxed mb-6">{post.excerpt}</p>
                <Link
                  to="/resources/blogs/$slug"
                  params={{ slug: post.slug }}
                  className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] font-semibold text-g700 hover:text-g500"
                >
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  );
}
