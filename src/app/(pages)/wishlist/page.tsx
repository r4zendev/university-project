import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DragFreeCarousel } from "~/components/carousels/basic";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getItems, getSettings, getTrendingItems } from "~/lib/sanity/queries";
import type { Item } from "~/lib/sanity/types";
import { getWishlistCookie } from "~/lib/utils/cookies";

export default async function Wishlist() {
  const { value: wishlist } = getWishlistCookie();
  if (!wishlist) return <p>Wishlist is empty</p>;
  const items = await getItems({
    ids: Object.keys(wishlist).map((key) => key.split(" ")[0]!),
  });

  const settings = await getSettings();

  let otherRecommendedProducts: Item[] = [];
  if (settings) {
    if (settings.enableForYou) {
      otherRecommendedProducts = await getTrendingItems();
    }
  } else {
    otherRecommendedProducts = await getTrendingItems();
  }

  return (
    <div className="container my-4 grid gap-4">
      {items.map((item) => {
        return (
          <Card key={item._id}>
            <CardContent className="flex items-center justify-between p-4">
              <Link href={item.url} className="flex items-start gap-4">
                <Image
                  alt="Product Image"
                  className="h-20 w-20 rounded-md object-cover"
                  width={80}
                  height={80}
                  src={item.images[0] ?? "/placeholder.webp"}
                  style={{
                    aspectRatio: "80/80",
                    objectFit: "cover",
                  }}
                />
                <div className="grid flex-1 gap-1">
                  <span className="text-lg font-medium">{item.name}</span>
                  <span className="text-md">{item.description}</span>
                </div>
              </Link>

              <Button className="w-12" variant="destructive">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <div className="mx-auto w-3/4">
        {otherRecommendedProducts.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h4>

            <DragFreeCarousel items={otherRecommendedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
