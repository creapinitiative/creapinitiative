import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/dashboard/CollectionManager";
import { galleryImageFields } from "@/lib/dashboard-fields";
import { galleryImagesApi } from "@/api/collections-api";

export const Route = createFileRoute("/dashboard/gallery")({
  loader: () => galleryImagesApi.list(),
  component: GalleryAdminPage,
});

function GalleryAdminPage() {
  const rows = Route.useLoaderData();

  return (
    <CollectionManager
      title="Gallery"
      description="Photos shown on the public Gallery page."
      fields={galleryImageFields}
      collectionKey="gallery"
      rows={rows}
      api={galleryImagesApi}
      getRowLabel={(row) => row.caption as string}
      getRowMeta={(row) => (row.tall ? "Tall card" : "Standard card")}
    />
  );
}
