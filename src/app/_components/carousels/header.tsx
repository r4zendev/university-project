"use client";

import emblaCarouselAutoplay from "embla-carousel-autoplay";
import { marked } from "marked";
import Link from "next/link";

import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import { type HeaderBanner } from "~/lib/sanity/types";

export const HeaderCarousel = ({ items }: { items: HeaderBanner[] }) => (
  <Carousel plugins={[emblaCarouselAutoplay({ delay: 5000 })]} opts={{ loop: true }}>
    <CarouselContent>
      {items.map((item) => (
        <CarouselItem className="w-full !p-0" key={item._id}>
          {item.url ? (
            <Link
              href={item.url}
              dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
              className="block cursor-pointer border-b bg-primary px-2 py-0.5 text-center text-primary-foreground sm:px-0"
              key={item._id}
            />
          ) : (
            <div
              className="cursor-default border-b bg-primary px-2 py-0.5 text-center text-primary-foreground sm:px-0"
              key={item._id}
              dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
            />
          )}
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);
