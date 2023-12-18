"use server";

import { clickItem } from "~/lib/sanity/queries";
import { addToViewsCookie, getViewsCookie } from "~/lib/utils/cookies";

export async function incrementViews(id: string) {
  const { value: viewed } = getViewsCookie();
  if (viewed?.includes(id)) return;

  addToViewsCookie(id);
  // TODO: Send analytics event for view instead of storing in Sanity
  await clickItem(id);
}
