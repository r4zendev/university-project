import { defineField, defineType } from "sanity";

export const navLinkSchema = defineType({
  name: "navLink",
  title: "Navigation link",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      description:
        "Links should be specified relative to main domain of the website. For example: /about",
      type: "string",
      validation: (Rule) => Rule.regex(/^\/([^\/\s]+\/?)*$/),
    }),
  ],
});

export const navLinksListSchema = defineType({
  name: "navLinksList",
  title: "Navigation links list",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "navLink" }],
    }),
  ],
});

export const navigationSchema = defineType({
  name: "nav",
  title: "Navigation",
  type: "document",
  fields: [
    ...navLinkSchema.fields,
    defineField({
      name: "subnav",
      title: "Sub navigation",
      type: "array",
      of: [{ type: "navLinksList" }],
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [
          { title: "Header", value: "header" },
          { title: "Products", value: "products" },
          { title: "Footer", value: "footer" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
