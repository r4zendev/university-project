import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "~/components/ui/card";
import type { Category, Item } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";

const ContentCard = ({ item }: { item: { name: string; image?: string } }) => (
  <Card className="relative overflow-hidden">
    <CardContent>
      <Image
        src={item.image ?? "/placeholder.webp"}
        alt={item.name ?? "Item"}
        width={200}
        height={200}
        className={cn(
          "h-auto w-auto object-cover transition-all hover:scale-105",
        )}
      />

      <span className="absolute text-lg left-1/2 bottom-0 translate-x-[-50%]">
        {item.name}
      </span>
    </CardContent>
  </Card>
);

export function TrendingItem({ item }: { item: Item }) {
  return (
    <Link
      href={`/products/${item.category.slug}/${item._id}`}
      className="overflow-hidden rounded-md w-[16rem] shrink-0"
    >
      <ContentCard item={item} />
    </Link>
  );
}

export function ViewedItem({ item }: { item: Item }) {
  return (
    <Link
      href={`/products/${item.category.slug}/${item._id}`}
      className="overflow-hidden rounded-md w-[16rem] shrink-0"
    >
      <ContentCard item={item} />
    </Link>
  );
}

export function CategoryItem({ item }: { item: Category }) {
  return (
    <Link
      href={`/products/${item.slug}`}
      className="overflow-hidden rounded-md w-[16rem] shrink-0"
    >
      <ContentCard item={item} />
    </Link>
  );
}
