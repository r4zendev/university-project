"use server";

import { currentUser } from "@clerk/nextjs";

import { sendEvent } from "~/lib/posthog";
import { clickItem } from "~/lib/sanity/queries";
import {
  addToViewsCookie,
  addToWishlistCookie,
  getViewsCookie,
} from "~/lib/utils/cookies";

export async function incrementViews(id: string) {
  const { value: viewed } = getViewsCookie();
  if (viewed?.includes(id)) return;

  const user = await currentUser();

  addToViewsCookie(id);
  addToWishlistCookie(id);
  sendEvent({ distinctId: user?.id ?? "unauthenticated", event: "added to wishlist" });
  await clickItem(id);
}
