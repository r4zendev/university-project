import { defineField, defineType } from "sanity";

export const bannerSchema = defineType({
  name: "banner",
  title: "Banners",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
      hidden: ({ document }) => (document?.position as string) === "header",
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if ((document?.position as string) === "header" || currentValue) return true;

          return "This is required with currently used banner type";
        }),
    }),
    defineField({
      name: "text",
      title: "Text content",
      type: "markdown",
      hidden: ({ document }) => (document?.position as string) !== "header",
      validation: (rule) =>
        rule.custom((currentValue, { document }) => {
          if (
            (document?.position as string) === "header" &&
            currentValue === undefined
          ) {
            return "This is required with currently used banner type";
          }

          return true;
        }),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.regex(/^\/([^\/\s]+\/?)*$/),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: ["slider", "top", "header"],
      },
    }),
  ],
});
