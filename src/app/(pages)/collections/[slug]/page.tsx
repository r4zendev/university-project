import { notFound } from "next/navigation";

import { DragFreeCarousel } from "~/components/carousels/basic";
import { Section } from "~/components/section";
import { getCollection } from "~/lib/sanity/queries";

export default async function CollectionPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const collection = await getCollection(slug);

  if (!collection) {
    return notFound();
  }

  return (
    <div className="w-full">
      <div className="w-full">
        {collection.sections?.map((section) => (
          <Section key={section._id} section={section} />
        ))}
      </div>

      <DragFreeCarousel items={collection.items} />
    </div>
  );
}
