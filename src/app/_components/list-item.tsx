import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "~/components/ui/card";
import type { Category, Item } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";

export type MinimumAcceptableItem = Pick<Item, "images" | "name" | "_id"> & {
  category: { slug: Item["category"]["slug"] };
};

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

      <span className="absolute bottom-0 left-1/2 translate-x-[-50%] text-lg">
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
      className={"w-[16rem] shrink-0 overflow-hidden rounded-md"}
    >
      <ContentCard
        className={className}
        item={{ name: item.name, image: item.images[0] }}
      />
    </Link>
  );
}

export function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/${category.slug}`}
      className="w-[16rem] shrink-0 overflow-hidden rounded-md"
    >
      <ContentCard item={category} />
    </Link>
  );
}
