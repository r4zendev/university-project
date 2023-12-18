"use client";

import Autoplay, { type AutoplayOptionsType } from "embla-carousel-autoplay";
import useEmblaCarousel, {
  type EmblaCarouselType,
  type EmblaOptionsType,
} from "embla-carousel-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState, type PropsWithChildren } from "react";

import { ListItem, type MinimumAcceptableItem } from "./list-item";

type ButtonPropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

export const DotButton: React.FC<
  ButtonPropType & {
    onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerUp?: (e: React.PointerEvent<HTMLButtonElement>) => void;
  }
> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

export const PrevButton: React.FC<ButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button className="embla__button embla__button--prev" type="button" {...restProps}>
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
        />
      </svg>
      {children}
    </button>
  );
};

export const NextButton: React.FC<ButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button className="embla__button embla__button--next" type="button" {...restProps}>
      <svg className="embla__button__svg" viewBox="0 0 532 532">
        <path
          fill="currentColor"
          d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        />
      </svg>
      {children}
    </button>
  );
};

type ItemCarouselProps = {
  slides: MinimumAcceptableItem[];
  options?: EmblaOptionsType & AutoplayOptionsType;
};

export const DragFreeItemsCarousel: React.FC<ItemCarouselProps> = (props) => {
  const { slides } = props;
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div className="relative w-full">
      <div className="embla embla-three-slides p-4">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, index) => (
              <div className="embla__slide" key={index}>
                {item.images[0] && <ListItem item={item} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type SimplePropType = {
  slides: JSX.Element[];
  options?: EmblaOptionsType & AutoplayOptionsType;
};

export const SimpleTextCarousel: React.FC<SimplePropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel(options, [Autoplay(options)]);

  return (
    <div className="relative w-full">
      <div className="embla embla-fullwidth-slide">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, index) => (
              <div className="embla__slide" key={`slide-${index}`}>
                <>{item}</>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type PropType = {
  slides: unknown[];
  options?: EmblaOptionsType & AutoplayOptionsType;
};

export const FrontPageCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(options)]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className="relative w-full">
      <div className="embla embla-fullwidth-slide">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((item, index) => (
              <div className="embla__slide h-[--slide-height]" key={`slide-${index}`}>
                {typeof item === "string" ? (
                  <Image fill src={item} alt="Alt logo" />
                ) : (
                  <>{item}</>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="embla__dots">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={`button-${index}`}
            onPointerDown={() => emblaApi?.plugins().autoplay?.stop()}
            onPointerUp={() => emblaApi?.plugins().autoplay?.play()}
            onClick={() => scrollTo(index)}
            className={"embla__dot".concat(
              index === selectedIndex ? " embla__dot--selected" : ""
            )}
          />
        ))}
      </div>
    </div>
  );
};
