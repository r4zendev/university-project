import { createClient } from "next-sanity";

import { env } from "~/env.mjs";

export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  studioUrl: "/admin",
  apiVersion: "2023-05-12",
  useCdn: true,
});
