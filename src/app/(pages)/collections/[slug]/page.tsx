import { notFound } from "next/navigation";

import { DragFreeItemsCarousel } from "~/components/carousel";
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

  console.log(collection);

  return (
    <div className="w-full">
      <div className="w-full">
        {collection.sections?.map((section) => (
          <Section key={section._id} section={section} />
        ))}
      </div>

      <DragFreeItemsCarousel slides={collection.items} />
    </div>
  );
}
