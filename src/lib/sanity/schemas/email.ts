import { defineField, defineType } from "sanity";

export const emailSchema = defineType({
  name: "emailTemplate",
  title: "Email templates",
  type: "document",
  fields: [
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "content",
      title: "Content",
      description: "Use markdown to format your email.",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),

    // Markdown is cool, but it's not for everyone, so here's the option to switch for.
    // defineField({
    //   name: "content",
    //   title: "Content",
    //   description: "Use rich text to format your email.",
    //   type: "array",
    //   of: [{ type: "block" }],
    //   validation: (Rule) => Rule.required(),
    // }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
      description: "Add a call to action to your email.",
    }),
  ],
});
