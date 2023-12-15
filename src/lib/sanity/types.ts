import { type SocialProvider } from "~/lib/types";

export type Category = {
  name: string;
  slug: string;
  image: string;
};

export type Banner = {
  _id: string;
  _createdAt: string;
  image: string;
  alt: string;
  url: string;
};

export type Item = {
  _id: string;
  _createdAt: string;
  name: string;
  description?: string;
  price: number;
  slug: string;
  image: string;
  discount?: number;
  discountedPrice?: number;
  url: string;
  content: string;
  category: Category;
  views: number;
};

export type SocialLink = {
  _id: string;
  _createdAt: string;
  provider: SocialProvider;
  url: string;
};
