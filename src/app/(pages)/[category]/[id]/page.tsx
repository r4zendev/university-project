import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

import { ListItem } from "~/components/list-item";
import { Button } from "~/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import {
  getItemById,
  getItems,
  getProductReviews,
  getSettings,
  getTrendingItems,
} from "~/lib/sanity/queries";
import type { Item } from "~/lib/sanity/types";
import { getCartCookie, getViewsCookie } from "~/lib/utils/cookies";
import { ProductOrder } from "./_components/product-order";
import { ReviewForm } from "./_components/review-form";
import { PaginatedReviews } from "./_components/reviews";
import { ViewsIncrementer } from "./_components/views-incrementer";

export default async function Product({
  params: { id },
}: {
  params: { category: string; id: string };
}) {
  const settings = await getSettings();
  const { value: viewed } = getViewsCookie();

  const product = await getItemById(id);
  if (!product) {
    return redirect("/");
  }

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
    <div>
      <ViewsIncrementer id={id} />

      <div className="mt-2 flex flex-col gap-4 p-1 lg:container">
        {/* Banners */}

        <div className="flex gap-4">
          <div className="basic-1/2 grid grid-cols-1 gap-6 lg:w-auto lg:flex-1 lg:grid-cols-2">
            {product.images?.length &&
              product.images.map((img) => (
                <Image
                  key={img}
                  src={img}
                  alt={product.name ?? "Item"}
                  width={500}
                  height={500}
                />
              ))}
          </div>

          <div className="shrink-0 basis-1/2 lg:basis-1/4">
            <h4 className="text-3xl font-bold tracking-tight">{product.name}</h4>

            <ProductOrder id={id} cart={cart} product={product} tags={tagsSelection} />
          </div>
        </div>

        {otherRecommendedProducts.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h4>

            <Carousel>
              <CarouselContent>
                {otherRecommendedProducts.map((item) => (
                  <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={item._id}>
                    <ListItem item={item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
              <PaginatedReviews reviews={productReviews} />
            ) : (
              <div className="my-8 text-center">
                <p className="text-semibold text-xl">No reviews yet</p>
                <p className="text-semibold text-2xl">Be the first one!</p>
              </div>
            )}
          </div>

          {viewedItems.length > 0 && (
            <div className="my-4 w-full rounded-xl bg-white px-8 py-4">
              <h2 className="text-center text-2xl font-semibold uppercase text-secondary-foreground">
                Recently viewed
              </h2>

              <Carousel>
                <CarouselContent className="justify-center">
                  {viewedItems.map((item) => (
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={item._id}>
                      <ListItem item={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
