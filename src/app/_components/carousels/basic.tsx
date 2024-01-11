"use client";

import Image from "next/image";
import Link from "next/link";

import { ListItem, type MinimumAcceptableItem } from "~/components/list-item";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export const DragFreeCarousel = ({
  items,
}: {
  items: (MinimumAcceptableItem & { url: string })[];
}) => {
  return (
    <Carousel opts={{ dragFree: true, containScroll: "trimSnaps" }} className="mx-16">
      <CarouselContent className="items-start">
        {items.map((item) => (
          <CarouselItem className="mx-auto basis-1/3 lg:basis-1/4" key={item._id}>
            <Link
              href={item.url}
              className="flex h-full flex-col items-center justify-between"
            >
              <Image
                src={
                  ("images" in item ? item.images.at(0) : item.image) ??
                  "/placeholder.webp"
                }
                alt={item.name ?? "Item"}
                width={500}
                height={500}
                className="m-auto pt-4 transition-all hover:scale-105"
              />

              <p className="mt-2 text-center text-sm font-medium lg:text-lg">
                {item.name}
              </p>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
};

export const DragFreeCarouselWithCards = ({
  items,
}: {
  items: MinimumAcceptableItem[];
}) => (
  <Carousel opts={{ dragFree: true, containScroll: "trimSnaps" }}>
    <CarouselContent>
      {items.map((item) => (
        <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={item._id}>
          <ListItem item={item} />
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);
