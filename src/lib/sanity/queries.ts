import { groq } from "next-sanity";

import { logger } from "~/lib/utils/log";
import { sanityClient } from "./client";
import type { Banner, Category, Item, SocialLink } from "./types";

export async function getItems(options?: {
  ids?: string[];
  limit?: number;
}): Promise<Item[]> {
  const { ids, limit } = options ?? {};
  const params = Object.fromEntries(
    Object.entries({ ids, limit }).filter(([, value]) => Boolean(value)),
  );

  try {
    return await sanityClient.fetch(
      groq`*[_type == "item"${ids ? " && _id in $ids" : ""}]${
        limit ? `[0...${limit}]` : ""
      }{
      _id,
      _createdAt,
      name,
      description,
      price,
      "slug": slug.current,
      "image": image.asset->url,
      "discountedPrice": price * (1 - discount),
      "category": category->{
        name,
        "image": image.asset->url,
        "slug": slug.current,
      },
      content
    }`,
      params,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching items");
    return [];
  }
}

export async function getTrendingItems(limit?: number): Promise<Item[]> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "item"]${`[0...${limit ?? 5}]`}{
        _id,
        _createdAt,
        name,
        description,
        price,
        "slug": slug.current,
        "image": image.asset->url,
        "discountedPrice": price * (1 - discount),
        "category": category->{
          name,
          "image": image.asset->url,
          "slug": slug.current,
        },
        views,
        content
      } | order(views desc)`,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching trending items");
    return [];
  }
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "item" && _id == $id][0]{
        _id,
        _createdAt,
        name,
        description,
        price,
        "slug": slug.current,
        "image": image.asset->url,
        "discountedPrice": price * (1 - discount),
        "category": category->{
          name,
          "image": image.asset->url,
          "slug": slug.current,
        },
        content
      }`,
      { id },
    );
  } catch (err) {
    logger.error({ err }, "Error fetching item by id");
    return null;
  }
}

export async function clickItem(id: string) {
  try {
    return await sanityClient.patch(id).inc({ views: 1 }).commit();
  } catch (err) {
    logger.error({ err }, "Error clicking item");
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "category"] {
        name,
        "slug": slug.current,
        "image": image.asset->url,
      }`,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching categories");
    return [];
  }
}

export async function getBannerImage(): Promise<Banner | null> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "banner" && position == "top"][0]{
        _id,
        _createdAt,
        "image": image.asset->url,
        "alt": image.alt,
        url,
      }`,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching banner image");
    return null;
  }
}

export async function getSliderImages(): Promise<Banner[]> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "banner" && position == "slider"][0...5]{
        _id,
        _createdAt,
        "image": image.asset->url,
        "alt": image.alt,
        url,
      }`,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching slider images");
    return [];
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    return await sanityClient.fetch(
      groq`*[_type == "social"]{
        _id,
        _createdAt,
        provider,
        url,
      }`,
    );
  } catch (err) {
    logger.error({ err }, "Error fetching social links");
    return [];
  }
}
