/* eslint-disable @typescript-eslint/require-await */
"use server";

import { currentUser } from "@clerk/nextjs";
import { cookies } from "next/headers";

import { sendEvent } from "~/lib/posthog";
import {
  addToCartCookie,
  CART_COOKIE_NAME,
  deleteFromCartCookie,
} from "~/lib/utils/cookies";

export async function addToCart(id: string) {
  const user = await currentUser();

  addToCartCookie(id);
  sendEvent({ distinctId: user?.id ?? "unauthenticated", event: "added to cart" });
}

export async function clearCart() {
  cookies().delete(CART_COOKIE_NAME);
}

export async function removeFromCart(id: string) {
  deleteFromCartCookie(id);
}
