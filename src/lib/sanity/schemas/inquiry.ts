import { defineField, defineType } from "sanity";

export const inquirySchema = defineType({
  name: "inquiry",
  title: "Inquiries",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone No.",
      type: "string",
    }),
    defineField({
      name: "actedOn",
      title: "Acted on",
      description: "Whether the inquiry has been responded",
      type: "boolean",
      validation: (Rule) => Rule.required(),
      initialValue: false,
    }),
  ],
});
