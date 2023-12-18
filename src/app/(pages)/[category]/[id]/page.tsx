import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { formatDistance } from "date-fns";
import { Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { DragFreeItemsCarousel } from "~/components/carousel";
import { ListItem } from "~/components/list-item";
import { Button } from "~/components/ui/button";
import {
  getItemById,
  getItems,
  getProductReviews,
  getSettings,
  getTrendingItems,
} from "~/lib/sanity/queries";
import type { Item } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";
import { getCartCookie, getViewsCookie } from "~/lib/utils/cookies";
import { ProductOrder } from "./_components/product-order";
import { ReviewForm } from "./_components/review-form";
import { ViewsIncrementer } from "./_components/views-incrementer";

export default async function Product({
  params: { id },
}: {
  params: { category: string; id: string };
}) {
  const settings = await getSettings();
  const { value: viewed } = getViewsCookie();

  const product = await getItemById(id);
  const productReviews = await getProductReviews(id);

  let otherRecommendedProducts: Item[] = [];
  let viewedItems: Item[] = [];
  if (settings) {
    if (settings.enableForYou) {
      otherRecommendedProducts = await getTrendingItems();
    }
    if (settings.enableRecentlyViewed) {
      viewedItems = viewed ? await getItems({ ids: viewed }) : [];
    }
  } else {
    otherRecommendedProducts = await getTrendingItems();
    viewedItems = viewed ? await getItems({ ids: viewed }) : [];
  }

  if (!product) {
    return notFound();
  }
  const { value: cart } = getCartCookie();

  const tagsSelection = product.tags
    ? product.tags.reduce(
        (acc, tag) => {
          if (!tag.required) return acc;

          return {
            ...acc,
            [tag.name]: acc[tag.name] ? [...acc[tag.name]!, tag.value] : [tag.value],
          };
        },
        {} as Record<string, string[]>
      )
    : {};

  return (
    <>
      <ViewsIncrementer id={id} />

      <div className="mt-2 flex flex-col gap-4">
        {/* Banners */}

        <div className="flex gap-4">
          <div className="grid flex-1 grid-cols-2 gap-6">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name ?? "Item"}
                width={500}
                height={500}
              />
            )}
          </div>

          <div className="shrink-0 basis-1/4">
            <h4 className="text-3xl font-bold tracking-tight">{product.name}</h4>

            <ProductOrder id={id} cart={cart} product={product} tags={tagsSelection} />
          </div>
        </div>

        {otherRecommendedProducts.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h4>

            <DragFreeItemsCarousel slides={otherRecommendedProducts} />
          </div>
        )}

        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <div className="flex w-full items-center justify-between">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              Latest reviews
            </h4>
            <SignedIn>
              <ReviewForm id={id} />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button className="text-md" variant="secondary">
                  Login to write a review
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          <div className="flex w-full flex-col gap-4 divide-y">
            {productReviews.length ? (
              productReviews.map((review) => (
                <div key={review._id} className="flex flex-col gap-2 pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex">
                      {Array.from({ length: review.rating })
                        .concat(
                          Array.from({ length: 5 - review.rating }).fill("unfilled")
                        )
                        .map((check, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              check !== "unfilled" && "fill-yellow-500 text-yellow-500"
                            )}
                          />
                        ))}
                    </div>
                    <p className="font-medium">{review.username ?? review.email}</p>
                    <p>
                      {formatDistance(new Date(review._createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <p className="text-md font-semibold">{review.title}</p>
                  <p className="text-lg">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="my-8 text-center">
                <p className="text-semibold text-xl">No reviews yet</p>
                <p className="text-semibold text-2xl">Be the first one!</p>
              </div>
            )}
          </div>

          {viewedItems.length > 0 && (
            <div className="my-4 w-full rounded-xl bg-white px-8 py-4">
              <h2 className="text-2xl font-semibold text-primary-foreground">
                Recently viewed
              </h2>

              <div className="mt-4 flex items-center justify-center gap-4">
                {viewedItems.map((item) => (
                  <ListItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
