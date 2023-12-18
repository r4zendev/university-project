import { type SocialProvider } from "~/lib/types";

export type Category = {
  name: string;
  slug: string;
  image: string;
};

type BaseBanner = {
  _id: string;
  _createdAt: string;
  url: string;
};

export type SliderBanner = BaseBanner & {
  position: "slider";
  image: string;
  alt: string;
};

export type HeaderBanner = BaseBanner & {
  position: "header";
  text: string;
};

export type TopBanner = BaseBanner & {
  position: "top";
  image: string;
  alt: string;
};

export type Banner = SliderBanner | HeaderBanner | TopBanner;

export type Item = {
  _id: string;
  _createdAt: string;
  name: string;
  description?: string;
  price: number;
  slug: string;
  images: string[];
  discount?: number;
  discountedPrice?: number;
  featured: boolean;
  url: string;
  content: string;
  category: Category;
  tags:
    | {
        name: string;
        required: boolean;
        value: string;
        badge?: string;
      }[]
    | null;
  views: number;
};

export type Email = {
  _id: string;
  _createdAt: string;
  subject: string;
  link?: string;
  // Markdown
  content: string;
};

export type Settings = {
  productName: string;
  enableFrontPageBanner: boolean;
  enableFrontPageSlider: boolean;
  enableHeaderBanners: boolean;
  enableFeaturedItems: boolean;
  enableTrendingItems: boolean;
  enableRecentlyViewed: boolean;
  enableForYou: boolean;
};

export type Review = {
  _id: string;
  _createdAt: string;
  username?: string;
  email: string;
  userId?: string;
  rating: number;
  title: string;
  content: string;
};

export type SocialLink = {
  _id: string;
  _createdAt: string;
  provider: SocialProvider;
  url: string;
};

type NavLink = {
  title: string;
  link: string;
};

export type Navigation = NavLink & {
  subnav: {
    title: string;
    links: NavLink[];
  }[];
};

export type Section = { _id: string; _createdAt: string } & (
  | { type: "itemlist"; items: Item[] }
  | { type: "text"; text: string }
  | { type: "image"; image: string }
  | { type: "slider"; images: string[] }
  | {
      type: "image-with-text";
      image: string;
      text: string;
      textStyle: "intrinsic" | "left" | "right";
    }
);

export type Page = {
  slug: string;
  sections?: Section[];
};

export type FAQGroup = {
  name: string;
  image: string;
  children: FAQ[];
};

export type FAQ = {
  title: string;
  content: string;
};

export type Inquiry = {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  actedOn: boolean;
};

export type Collection = {
  name: string;
  slug: string;
  description: string;
  items: Item[];
  sections?: Section[];
};

export type Order = {
  content: string;
  email: string;
  address: string;
  amountPaid: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
};
