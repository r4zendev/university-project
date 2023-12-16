import {
  navigationSchema,
  navLinkSchema,
  navLinksListSchema,
} from "~/lib/sanity/schemas/nav";
import { bannerSchema } from "./banner";
import { categorySchema } from "./category";
import { itemSchema } from "./item";
import { socialSchema } from "./social";

export const schemas = [
  itemSchema,
  categorySchema,
  socialSchema,
  bannerSchema,
  navigationSchema,
  navLinkSchema,
  navLinksListSchema,
];
