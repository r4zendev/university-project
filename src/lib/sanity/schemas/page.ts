import { defineField, defineType } from "sanity";

export const customPageSchema = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      description: "The slug for this page. URL will be /pages/{slug}. Must be unique.",
      type: "string",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "section" }] }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
