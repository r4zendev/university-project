import { defineField, defineType } from "sanity";

import { SOCIAL_PROVIDERS } from "~/lib/types";

export const socialSchema = defineType({
  name: "social",
  title: "Social links",
  type: "document",
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      options: { list: SOCIAL_PROVIDERS as unknown as string[] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required().regex(/https?:\/\/.+/),
    }),
  ],
});

export type SocialLink = typeof socialSchema;
