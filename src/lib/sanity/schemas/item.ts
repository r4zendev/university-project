import { defineField, defineType } from "sanity";

export const itemSchema = defineType({
  name: "item",
  title: "Items",
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
      name: "price",
      title: "Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: { source: "name" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" as const }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "views",
      type: "number",
      title: "Views",
      initialValue: 0,
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Add images to show in the gallery. First image will be used as the main image.",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" as const }],
    }),
    defineField({
      name: "tags",
      title: "Tags (filters)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
});
