import { groq, type QueryParams } from "next-sanity";

import { env } from "~/env.mjs";
import { logger } from "~/lib/utils/log";
import { sanityClient } from "./client";
import {
  GET_ALL_CATEGORIES_TAG,
  GET_ALL_ITEMS_TAG,
  GET_ALL_ORDERS_TAG,
  GET_ALL_TAGS_TAG,
  GET_BANNER_IMAGE_TAG,
  GET_COLLECTIONS_TAG,
  GET_EMAIL_TEMPLATES_TAG,
  GET_FAQ_GROUPS_TAG,
  GET_HEADER_BANNERS_TAG,
  GET_ITEM_BY_ID_TAG,
  GET_NAV_LINKS_TAG,
  GET_PAGE_TAG,
  GET_PENDING_ORDERS_TAG,
  GET_REVIEWS_TAG,
  GET_SETTINGS_TAG,
  GET_SLIDER_IMAGES_TAG,
  GET_SOCIAL_LINKS_TAG,
  GET_TRENDING_ITEMS_TAG,
  GET_UNACTED_INQUIRIES_TAG,
} from "./tags";
import type {
  Category,
  Collection,
  Email,
  FAQGroup,
  HeaderBanner,
  Inquiry,
  Item,
  Navigation,
  Order,
  Page,
  Review,
  SearchedItem,
  SearchedPage,
  Settings,
  SliderBanner,
  SocialLink,
  Tag,
  TopBanner,
} from "./types";

export async function sanityFetch<QueryResponse>({
  query,
  params,
  revalidate,
  tags,
  cache,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number;
  tags: string[];
  cache?: RequestCache;
}): Promise<QueryResponse> {
  return sanityClient.fetch<QueryResponse>(query, params, {
    cache: cache ?? revalidate ? undefined : "force-cache",
    next: { revalidate, tags },
  });
}

const itemQueryFields = `
  _id,
  _createdAt,
  name,
  description,
  "slug": slug.current,
  price,
  discount,
  featured,
  "url": "/" + category->slug.current + "/" + _id,
  "images": images[].asset->url,
  "discountedPrice": price * (1 - discount / 100),
  "category": category->{
    name,
    "image": image.asset->url,
    "slug": slug.current,
  },
  tags[]->{
    "name": tagGroup->name,
    "required": tagGroup->required,
    value,
    "badge": badge.asset->url,
  },
  "collection": collection->{
    name,
    "slug": slug.current,
  },
  views,
  content
`;

const sectionQuery = `
  _id,
  _createdAt,
  type,
  text,
  ratio,
  "image": image.asset->url,
  "images": images[].asset->url,
  textStyle,
  "items": items[]->{
    ${itemQueryFields}
  }
`;

export type ItemSortOptions = "popular" | "date" | "low" | "high";

type ItemQueryOptions = {
  ids?: string[];
  limit?: number;
  category?: string;
  featured?: boolean;
  tags?: Record<string, string[]>;
  // "popular" | "date" | "low" | "high";
  sort?: ItemSortOptions;
};

const itemPropsMapper: Record<
  keyof Omit<ItemQueryOptions, "limit" | "tags" | "sort">,
  {
    mapped: keyof Item | `${keyof Item}->${string}` | `${keyof Item}.${string}`;
    operator: "in" | "==";
  }
> = {
  ids: { mapped: "_id", operator: "in" },
  category: { mapped: "category->slug.current", operator: "==" },
  featured: { mapped: "featured", operator: "==" },
};

export async function getItems(options?: ItemQueryOptions): Promise<Item[]> {
  const { limit, tags: _, sort } = options ?? {};
  const params = Object.fromEntries(
    Object.entries(options ?? {}).filter(([, value]) => Boolean(value))
  );

  const queryString = Object.keys(params).reduce((acc, key) => {
    if (key in itemPropsMapper) {
      const { mapped, operator } = itemPropsMapper[key as keyof typeof itemPropsMapper];
      return acc + ` && ${mapped} ${operator} $${key}`;
    }

    return acc;
  }, "");

  // TODO:
  // const mappedTags = tags
  //   ? Object.entries(tags).reduce((acc, [key, value]) => {
  //       return (
  //         acc +
  //         ` && tags[]->name == "${key}" && tags[]->value in [${value
  //           .map((tag) => `"${tag}"`)
  //           .toString()}]`
  //       );
  //     }, "")
  //   : null;

  let sortQuery: string;
  switch (sort) {
    case "popular":
      sortQuery = "views desc";
      break;
    case "date":
      sortQuery = "_createdAt desc";
      break;
    case "low":
      sortQuery = "price asc";
      break;
    case "high":
      sortQuery = "price desc";
      break;
    default:
      sortQuery = "_createdAt desc";
      break;
  }

  try {
    return await sanityFetch({
      query: groq`*[_type == "item"${queryString}]${limit ? `[0...${limit}]` : ""}{
          ${itemQueryFields}
        } | order(${sortQuery})`,
      params,
      tags: [GET_ALL_ITEMS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching items");
    return [];
  }
}

export async function getTrendingItems(limit?: number): Promise<Item[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "item"]${`[0...${limit ?? 5}]`}{
          ${itemQueryFields}
        } | order(views desc)`,
      tags: [GET_TRENDING_ITEMS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching trending items");
    return [];
  }
}

export async function getProductReviews(id: string): Promise<Review[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "review" && item->_id == $id]{
        _id,
        _createdAt,
        title,
        content,
        rating,
        username,
        userId,
      } | order(_createdAt desc)`,
      params: { id },
      tags: [GET_REVIEWS_TAG],
    });
  } catch (err) {
    logger.error({ err }, `Error fetching reviews for item with id ${id}`);
    return [];
  }
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "item" && _id == $id][0]{
          ${itemQueryFields}
        }`,
      params: { id },
      tags: [GET_ITEM_BY_ID_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching item by id");
    return null;
  }
}

export async function submitReview(
  data: Omit<Review, "_id" | "_createdAt"> & { id: string }
) {
  if (!env.SANITY_TOKEN) {
    throw new Error(
      "SANITY_TOKEN is not defined. Submitting a review is not possible."
    );
  }

  const { id, ...restData } = data;

  try {
    return await sanityClient.create({
      _type: "review",
      item: { _type: "reference", _ref: id },
      ...restData,
    });
  } catch (err) {
    logger.error({ err }, "Error submitting review");
    throw err;
  }
}

export async function deleteReviews() {
  try {
    return await sanityClient.delete({
      query: "*[_type == 'review']",
    });
  } catch (err) {
    logger.error({ err }, "Error deleting reviews");
    throw err;
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
    return await sanityFetch({
      query: groq`*[_type == "category"] {
        _id,
        name,
        "slug": slug.current,
        "image": image.asset->url,
      }`,
      tags: [GET_ALL_CATEGORIES_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching categories");
    return [];
  }
}

export async function getBannerImage(): Promise<TopBanner | null> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "banner" && position == "top"][0]{
          _id,
          _createdAt,
          "image": image.asset->url,
          "alt": image.alt,
          url,
        }`,
      tags: [GET_BANNER_IMAGE_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching banner image");
    return null;
  }
}

export async function getTopScrollBanners(): Promise<HeaderBanner[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "banner" && position == "header"]{
        _id,
        _createdAt,
        text,
        url,
      }`,
      tags: [GET_HEADER_BANNERS_TAG],
      cache: "no-cache",
    });
  } catch (err) {
    logger.error({ err }, "Error fetching header slider");
    return [];
  }
}

export async function getSliderImages(): Promise<SliderBanner[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "banner" && position == "slider"][0...5]{
        _id,
        _createdAt,
        "image": image.asset->url,
        "alt": image.alt,
        url,
      }`,
      tags: [GET_SLIDER_IMAGES_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching slider images");
    return [];
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "social"]{
          _id,
          _createdAt,
          provider,
          url,
        }`,
      tags: [GET_SOCIAL_LINKS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching social links");
    return [];
  }
}

export async function getNavLinks(
  type: "header" | "products" | "footer"
): Promise<Navigation[]> {
  try {
    return await sanityFetch({
      query: groq`*[_type == "nav" && position == "${type}"]{
        title,
        link,
        subnav[]{
          title,
          links[]{
            title,
            link,
          }
        }
      } | order(_createdAt asc)`,
      tags: [GET_NAV_LINKS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching navigation links");
    return [];
  }
}

export async function getEmails(): Promise<Email[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "emailTemplate"]{
        _id,
        _createdAt,
        subject,
        link,
        content,
      }`,
      tags: [GET_EMAIL_TEMPLATES_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching navigation links");
    return [];
  }
}

export async function getSettings(): Promise<Settings | null> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "settings"][0]{
        _id,
        _createdAt,
        productName,
        enableFrontPageBanner,
        enableFrontPageSlider,
        enableHeaderBanners,
        enableFeaturedItems,
        enableTrendingItems,
        enableRecentlyViewed,
        enableForYou
      }`,
      revalidate: 5,
      tags: [GET_SETTINGS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching settings");
    return null;
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "page" && slug == $slug][0]{
        _id,
        _createdAt,
        slug,
        sections[]->{
          ${sectionQuery}
        }
      }`,
      params: { slug },
      tags: [GET_PAGE_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching page");
    return null;
  }
}

export async function getFAQGroups(): Promise<FAQGroup[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "faqGroup"]{
        _id,
        _createdAt,
        name,
        "image": image.asset->url,
        children[]->
      }`,
      tags: [GET_FAQ_GROUPS_TAG],
      cache: "no-cache",
    });
  } catch (err) {
    logger.error({ err }, "Error fetching faq groups");
    return [];
  }
}

export async function getUnactedInquiries(): Promise<Inquiry[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "faqGroup" && actedOn == false]{
        _id,
        _createdAt,
        name,
        email,
        subject,
        message,
        phone,
        actedOn,
      }`,
      tags: [GET_UNACTED_INQUIRIES_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching unacted inquiries");
    return [];
  }
}

export async function createOrder(data: Omit<Order, "status">): Promise<Order> {
  try {
    return await sanityClient.create({
      _type: "order",
      ...data,
      status: "pending",
    } as const);
  } catch (err) {
    logger.error({ err }, "Error creating an order");
    console.error(err);
    return {} as Order;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "order"]{
        _id,
        _createdAt,
        content,
        email,
        address,
        amountPaid,
        status
      }`,
      tags: [GET_ALL_ORDERS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching orders");
    return [];
  }
}

export async function getPendingOrders(): Promise<Order[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "order" && status == "pending"]{
        _id,
        _createdAt,
        content,
        email,
        address,
        amountPaid,
        status
      }`,
      tags: [GET_PENDING_ORDERS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching pending orders");
    return [];
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "collection"]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        description,
        sections[]->{
          ${sectionQuery}
        },
      }`,
      tags: [GET_COLLECTIONS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching collections");
    return [];
  }
}

export async function getCollection(slug: string): Promise<Collection | null> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "collection" && slug.current == $slug][0]{
        _id,
        _createdAt,
        name,
        slug,
        description,
        sections[]->{
          ${sectionQuery}
        },
      }`,
      params: { slug },
      tags: [GET_COLLECTIONS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching collection");
    return null;
  }
}

export async function getAllTags(group?: string): Promise<Tag[]> {
  try {
    return await sanityFetch({
      query: groq`
      *[_type == "tag"${group ? ` && tagGroup->name == $group` : ""}]{
        _id,
        _createdAt,
        value,
        "image": badge.asset->url,
        "tagGroup": tagGroup->{
          name,
          required,
        },
      }`,
      params: { group },
      tags: [GET_ALL_TAGS_TAG],
    });
  } catch (err) {
    logger.error({ err }, "Error fetching collection");
    return [];
  }
}

export async function getSearchQuery(query: string): Promise<{
  items: SearchedItem[];
  pages: SearchedPage[];
}> {
  try {
    const items: SearchedItem[] = await sanityFetch({
      query: groq`
      *[_type == "item" && name match "${query}*"]{
        _id,
        _createdAt,
        name,
        description,
        "slug": slug.current,
        "images": images[].asset->url,
        price,
        "discountedPrice": price * (1 - discount / 100),
        "url": "/" + category->slug.current + "/" + _id,
      }`,
      params: { query },
      tags: [GET_ALL_TAGS_TAG],
    });

    const pages: SearchedPage[] = await sanityFetch({
      query: groq`
      *[_type == "page" && slug match "${query}*"]{
        _id,
        _createdAt,
        slug,
      }`,
      params: { query },
      tags: [GET_ALL_TAGS_TAG],
    });

    return { items, pages };
  } catch (err) {
    logger.error({ err }, "Error fetching collection");
    return { items: [], pages: [] };
  }
}
