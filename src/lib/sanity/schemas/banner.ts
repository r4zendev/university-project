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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required().regex(/https?:\/\/.+/),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: ["slider", "top"],
      },
    }),
  ],
});
