import { marked } from "marked";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";

import { DragFreeCarousel } from "~/components/carousels/basic";
import { TopPageCarousel } from "~/components/carousels/top-page";
import { type Section } from "~/lib/sanity/types";
import { AspectRatio } from "./ui/aspect-ratio";

export async function Section({ section }: { section: Section }) {
  let Component: ReactNode = null;

  if ("text" in section && section.text) {
    section.text = await marked.parse(section.text);
  }

  if (section.type === "image") {
    Component = <Image fill src={section.image} alt="Section image" />;
  } else if (section.type === "image-with-text") {
    let SubComponent: ReactNode = null;

    if (section.textStyle === "left") {
      SubComponent = (
        <div className="relative h-full w-full md:w-2/3">
          <Image fill src={section.image} alt="Section image" />

          <div
            className="absolute inset-0 left-[10%] top-[50%] z-50 flex h-full w-full translate-y-[-50%] items-center justify-center text-center md:w-1/3"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />
        </div>
      );
    } else if (section.textStyle === "right") {
      SubComponent = (
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 left-[5%] z-50 flex h-full w-full items-center text-center md:w-1/3"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />

          <Image fill src={section.image} alt="Section image" />
        </div>
      );
    } else {
      SubComponent = (
        <>
          <Image fill src={section.image} alt="Section image" />

          <div
            className="inset-0 z-50 flex h-full w-full flex-col items-center justify-center text-center"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />
        </>
      );
    }

    Component = (
      <div className="relative flex h-full flex-col md:flex-row">{SubComponent}</div>
    );
  } else if (section.type === "text") {
    Component = <div dangerouslySetInnerHTML={{ __html: section.text }} />;
  } else if (section.type === "itemlist") {
    Component = <DragFreeCarousel items={section.items} />;
  } else if (section.type === "slider") {
    Component = <TopPageCarousel items={section.images} />;
  }

  const [x, y] = section.ratio?.split("/").map((x) => Number(x.trim())) ?? [];
  const ratio = x && y ? x / y : null;

  return ratio ? (
    <AspectRatio ratio={ratio}>{Component}</AspectRatio>
  ) : (
    <div className="w-full p-2 lg:container">{Component}</div>
  );
}
