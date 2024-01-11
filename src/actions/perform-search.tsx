"use server";

import { getSearchQuery } from "~/lib/sanity/queries";

export async function performSearch(query: string) {
  return getSearchQuery(query);
}
