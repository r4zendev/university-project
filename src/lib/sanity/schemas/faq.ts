import { defineField, defineType } from "sanity";

// Order Information

// Shipping

// Returns & Exchanges

// Contact Us

// My Account

// Services

export const faqGroupSchema = defineType({
  name: "faqGroup",
  title: "FAQ Groups",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
    }),
    defineField({
      name: "children",
      title: "Questions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const faqSchema = defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
