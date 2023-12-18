import { defineField, defineType } from "sanity";

export const reviewSchema = defineType({
  name: "review",
  title: "Reviews",
  type: "document",
  fields: [
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      readOnly: true,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "item",
      title: "Item",
      type: "reference",
      to: [{ type: "item" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
