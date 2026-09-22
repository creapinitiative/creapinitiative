import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug } from "@/api/collections-api";

export const Route = createFileRoute("/resources/blogs/$slug")({
  loader: ({ params }) => getBlogPostBySlug({ data: { slug: params.slug } }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();

  if (!post) {
    return (
      <section className="min-h-[70vh] grid place-items-center bg-bg px-6 pt-44 pb-24">
        <div className="max-w-xl text-center">
          <p className="eyebrow-dark mb-4">Resource Not Found</p>
          <h1 className="display-md mb-4">Blog Post Not Found</h1>
          <p className="text-ink3 mb-7">
            The article you are looking for does not exist or may have been moved.
          </p>
          <Link
            to="/resources/blogs"
            className="inline-flex items-center gap-2 border border-rule hover:border-g500 text-ink2 hover:text-g700 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-sm transition"
          >
            <ArrowLeft size={14} /> Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="bg-bg pt-[150px] lg:pt-[190px] pb-20 lg:pb-24">
      <div className="mx-auto max-w-[920px] px-5 sm:px-8 md:px-12 lg:px-28">
        <Link
          to="/resources/blogs"
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.12em] uppercase text-g700 hover:text-g500 mb-7"
        >
          <ArrowLeft size={14} /> Back to Blogs
        </Link>

        <p className="eyebrow-dark mb-4">{post.category}</p>
        <h1 className="display-lg mb-4">{post.title}</h1>
        <p className="text-sm text-ink4 tracking-wide mb-8">
          {post.date} · {post.author} · {post.read_minutes}
        </p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-[360px] md:h-[460px] object-cover rounded-sm border border-rule mb-10"
          />
        )}

        <div className="space-y-6 text-lg text-ink2 leading-relaxed">
          {(post.content ?? []).map((paragraph: string) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
