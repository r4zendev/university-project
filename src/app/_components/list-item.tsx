import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "~/components/ui/card";
import type { Category, Item } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";

export type MinimumAcceptableItem = Pick<Item, "name" | "_id"> & {
  category: { slug: Item["category"]["slug"] };
} & (Pick<Item, "images"> | Pick<Category, "image">);

const ContentCard = ({
  item,
  className,
}: {
  item: { name: string; image: string | undefined };
  className?: string;
}) => (
  <Card className={cn("relative h-full overflow-hidden", className)}>
    <CardContent>
      <Image
        src={item.image ?? "/placeholder.webp"}
        alt={item.name ?? "Item"}
        width={500}
        height={500}
        className={cn(
          "mx-auto h-auto w-auto object-cover pt-4 transition-all hover:scale-105"
        )}
      />

      <span className="absolute bottom-0 left-1/2 translate-x-[-50%] whitespace-nowrap text-sm font-medium md:text-lg">
        {item.name}
      </span>
    </CardContent>
  </Card>
);

export function ListItem({
  item,
  className,
}: {
  item: MinimumAcceptableItem;
  className?: string;
}) {
  return (
    <Link
      href={`/${item.category.slug}/${item._id}`}
      className="w-full shrink-0 overflow-hidden rounded-md"
    >
      <ContentCard
        className={className}
        item={{
          name: item.name,
          image: "images" in item ? item.images.at(0) : item.image,
        }}
      />
    </Link>
  );
}

export function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="w-full shrink-0 overflow-hidden rounded-md"
    >
      <ContentCard item={category} />
    </Link>
  );
}
