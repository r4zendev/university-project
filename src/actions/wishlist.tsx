/* eslint-disable @typescript-eslint/require-await */
"use server";

import { currentUser } from "@clerk/nextjs";

import { sendEvent } from "~/lib/posthog";
import { addToWishlistCookie, deleteFromWishlistCookie } from "~/lib/utils/cookies";

export async function addToWishlist(id: string) {
  const user = await currentUser();
  addToWishlistCookie(id);
  sendEvent({ distinctId: user?.id ?? "unauthenticated", event: "added to wishlist" });
}

export async function removeFromWishlist(id: string) {
  deleteFromWishlistCookie(id);
}
