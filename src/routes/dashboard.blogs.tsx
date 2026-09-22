import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { blogPostFields } from "@/lib/dashboard-fields";
import { blogPostsApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/blogs")({
  loader: () => blogPostsApi.list(),
  component: BlogsAdminPage,
});

function BlogsAdminPage() {
  const rows = Route.useLoaderData();

  return (
    <CollectionManager
      title="Blogs"
      description="Articles shown on the public Blogs page."
      fields={blogPostFields}
      collectionKey="blogs"
      rows={rows}
      api={blogPostsApi}
      getRowLabel={(row) => row.title as string}
      getRowMeta={(row) => `${row.category} · ${row.date}`}
    />
  );
}
