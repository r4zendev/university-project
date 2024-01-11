"use server";

import { createOrder } from "~/lib/sanity/queries";

export async function placeOrder(data: Parameters<typeof createOrder>[0]) {
  await createOrder(data);
}
