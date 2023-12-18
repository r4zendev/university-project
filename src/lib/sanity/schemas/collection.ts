import { defineField, defineType } from "sanity";

export const collectionSchema = defineType({
  name: "collection",
  title: "Collections",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: { source: "name" },
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "reference", to: [{ type: "item" }] }],
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
