import { defineField, defineType } from "sanity";

export const sectionSchema = defineType({
  name: "section",
  title: "Sections",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: ["text", "image", "image-with-text", "slider", "itemlist"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "item" }] }],
      hidden: ({ document }) => document?.type !== "itemlist",
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if (document?.type === "itemlist" && currentValue === undefined) {
            return "This is required with currently used section type";
          }

          return true;
        }),
    }),
    defineField({
      name: "text",
      title: "Content",
      type: "markdown",
      hidden: ({ document }) =>
        !["text", "image-with-text"].includes(document?.type as string),
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if (
            ["text", "image-with-text"].includes(document?.type as string) &&
            currentValue === undefined
          ) {
            return "This is required with currently used section type";
          }

          return true;
        }),
    }),
    defineField({
      name: "textStyle",
      title: "Text position",
      description:
        "The position of the text in the section. It can be inside image or on the left/right side of it. Style further text appearance with markdown html tags and styles.",
      type: "string",
      options: { list: ["intrinsic", "left", "right"] },
      hidden: ({ document }) => (document?.type as string) !== "image-with-text",
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if (
            (document?.type as string) === "image-with-text" &&
            currentValue === undefined
          ) {
            return "This is required with currently used section type";
          }

          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
      hidden: ({ document }) =>
        !["image", "image-with-text"].includes(document?.type as string),
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if (
            ["image", "image-with-text"].includes(document?.type as string) &&
            currentValue === undefined
          ) {
            return "This is required with currently used section type";
          }

          return true;
        }),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt", type: "string" }],
        },
      ],
      hidden: ({ document }) => (document?.type as string) !== "slider",
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if ((document?.type as string) === "slider" && currentValue === undefined) {
            return "This is required with currently used section type";
          }

          return true;
        }),
    }),
    defineField({
      name: "ratio",
      title: "Ratio",
      type: "string",
      description: "Specify the ratio as x / y. For example 16 / 9",
    }),
  ],
});
