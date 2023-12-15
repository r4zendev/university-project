"use server";

import { addToCartCookie } from "~/lib/utils/cookies";

// eslint-disable-next-line @typescript-eslint/require-await
export async function addToCart(id: string) {
  addToCartCookie(id);
  // TODO: Send analytics event for add to cart
  // await sendAnalytics()
}
