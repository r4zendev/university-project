/* eslint-disable @typescript-eslint/require-await */
"use server";

import { addToCartCookie, deleteFromCartCookie } from "~/lib/utils/cookies";

export async function addToCart(id: string) {
  addToCartCookie(id);
  // TODO: Send analytics event for add to cart
  // await sendAnalytics()
}

export async function removeFromCart(id: string) {
  deleteFromCartCookie(id);
  // TODO: Send analytics event for delete from cart
  // await sendAnalytics()
}
