import { defineField, defineType } from "sanity";

export const tagGroupSchema = defineType({
  name: "tagGroup",
  title: "Tag Group",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Filter category",
      description: "This name will be used to put this tag in appropriate filter.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Required",
      description:
        "Determines if this tag group has to be selected in order to add the item to cart.",
      type: "boolean",
      initialValue: false,
    }),
    // defineField({
    //   name: "transparent",
    //   title: "Transparent",
    //   description:
    //     "Determines if this tag group is showed anywhere or is it just for filtering purposes.",
    //   type: "boolean",
    //   initialValue: false,
    // }),
  ],
});

export const tagSchema = defineType({
  name: "tag",
  title: "Tags",
  type: "document",
  fields: [
    defineField({
      name: "tagGroup",
      title: "Tag group name",
      type: "reference",
      to: [{ type: "tagGroup" }],
    }),
    defineField({
      name: "value",
      title: "Value",
      description: "Values of a tag is used to display it in the UI.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "image",
      description: "You can add an image to display in tag's badge.",
      options: { hotspot: true },
    }),
  ],
});
