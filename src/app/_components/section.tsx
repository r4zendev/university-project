import { marked } from "marked";
import Image from "next/image";
import type { ReactNode } from "react";

import { DragFreeItemsCarousel, FrontPageCarousel } from "~/components/carousel";
import { type Section } from "~/lib/sanity/types";

export async function Section({ section }: { section: Section }) {
  let Component: ReactNode = null;

  if ("text" in section) {
    section.text = await marked.parse(section.text);
  }

  if (section.type === "image") {
    Component = <Image fill src={section.image} alt="Section image" />;
  } else if (section.type === "image-with-text") {
    let SubComponent: ReactNode = null;

    if (section.textStyle === "left") {
      SubComponent = (
        <>
          <div className="relative md:w-2/3">
            <Image fill src={section.image} alt="Section image" />
          </div>

          <div
            className="md:w-1/3"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />
        </>
      );
    } else if (section.textStyle === "right") {
      SubComponent = (
        <>
          <div
            className="md:w-1/3"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />
          <div className="relative md:w-2/3">
            <Image fill src={section.image} alt="Section image" />
          </div>
        </>
      );
    } else {
      SubComponent = (
        <>
          <Image fill src={section.image} alt="Section image" />

          <div
            className="inset-0 z-50 w-full"
            dangerouslySetInnerHTML={{ __html: section.text }}
          />
        </>
      );
    }

    Component = (
      <div className="relative flex h-full flex-col md:flex-row">{SubComponent}</div>
    );
  } else if (section.type === "text") {
    Component = <p>{section.text}</p>;
  } else if (section.type === "itemlist") {
    Component = <DragFreeItemsCarousel slides={section.items} />;
  } else if (section.type === "slider") {
    Component = <FrontPageCarousel slides={section.images} />;
  }

  return <div className="h-[30rem] w-full">{Component}</div>;
}
