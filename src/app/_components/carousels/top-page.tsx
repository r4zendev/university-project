"use client";

import emblaCarouselAutoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import { type SliderBanner } from "~/lib/sanity/types";

type TopPageCarouselProps = {
  items: SliderBanner[] | string[];
};

export const TopPageCarousel = ({ items }: TopPageCarouselProps) => {
  return (
    <Carousel plugins={[emblaCarouselAutoplay({ delay: 7000 })]}>
      <CarouselContent>
        {items.map((item) =>
          typeof item === "string" ? (
            <CarouselItem key={`image-${item}`}>
              <AspectRatio ratio={16 / 7}>
                <Image fill src={item} alt="Carousel image" />
              </AspectRatio>
            </CarouselItem>
          ) : (
            <CarouselItem key={item._id}>
              <AspectRatio ratio={16 / 7}>
                {item.url ? (
                  <Link href={item.url}>
                    <Image fill src={item.image} alt={item.alt} />
                  </Link>
                ) : (
                  <Image fill src={item.image} alt={item.alt} />
                )}
              </AspectRatio>
            </CarouselItem>
          )
        )}
      </CarouselContent>
    </Carousel>
  );
};
