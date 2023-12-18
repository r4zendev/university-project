import {
  navigationSchema,
  navLinkSchema,
  navLinksListSchema,
} from "~/lib/sanity/schemas/nav";
import { bannerSchema } from "./banner";
import { categorySchema } from "./category";
import { collectionSchema } from "./collection";
import { emailSchema } from "./email";
import { faqGroupSchema, faqSchema } from "./faq";
import { inquirySchema } from "./inquiry";
import { itemSchema } from "./item";
import { orderSchema } from "./order";
import { customPageSchema } from "./page";
import { reviewSchema } from "./review";
import { sectionSchema } from "./section";
import { settingsSchema } from "./settings";
import { socialSchema } from "./social";
import { tagGroupSchema, tagSchema } from "./tag";

export const schemas = [
  itemSchema,
  reviewSchema,
  tagSchema,
  tagGroupSchema,
  categorySchema,
  socialSchema,
  bannerSchema,
  sectionSchema,
  navigationSchema,
  navLinkSchema,
  navLinksListSchema,
  emailSchema,
  settingsSchema,
  faqSchema,
  faqGroupSchema,
  inquirySchema,
  customPageSchema,
  collectionSchema,
  orderSchema,
];
