/* eslint-disable @typescript-eslint/require-await */
"use server";

import { addToWishlistCookie, deleteFromWishlistCookie } from "~/lib/utils/cookies";

export async function addToWishlist(id: string) {
  addToWishlistCookie(id);
  // TODO: Send analytics event for add to Wishlist
  // await sendAnalytics()
}

export async function removeFromWishlist(id: string) {
  deleteFromWishlistCookie(id);
  // TODO: Send analytics event for delete from Wishlist
  // await sendAnalytics()
}
