import { defineField, defineType } from "sanity";

export const settingsSchema = defineType({
  name: "settings",
  title: "Settings",
  description:
    "There has to be exactly one of this record. This is the place where you can configure your store.",
  type: "document",
  fields: [
    defineField({
      name: "productName",
      title: "Product name",
      description: "Will be used in emails, etc..",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enableFrontPageBanner",
      title: "Enable front page banner",
      type: "boolean",
      description:
        "Enable banner on front page. You can configure the images under Banners section.",
      initialValue: true,
    }),
    defineField({
      name: "enableFrontPageSlider",
      title: "Enable front page slider",
      type: "boolean",
      description:
        "Enable slider on front page. You can configure the images under Banners section.",
      initialValue: true,
    }),
    defineField({
      name: "enableHeaderBanners",
      title: "Enable header sliding banners",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "enableFeaturedItems",
      title: "Enable featured items section",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "enableTrendingItems",
      title: "Enable trending items section",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "enableRecentlyViewed",
      title: "Enable recently viewed section",
      description:
        "This section appears on front page and shows the user their recently viewed items.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "enableForYou",
      title: "Enable for you section",
      description:
        "This section is displayed on individual items' pages and shows the user items based on their interests.",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
