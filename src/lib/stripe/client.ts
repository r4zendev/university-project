import Stripe from "stripe";

import { env } from "~/env.mjs";

// DONT USE ON CLIENT
export const stripeApi = new Stripe(env.STRIPE_SECRET_KEY);

export const stripe = new Stripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
  apiVersion: "2023-10-16",
});
