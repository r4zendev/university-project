"use server";

import { revalidateTag } from "next/cache";
import { type Input as Infer } from "valibot";

import { submitReview } from "~/lib/sanity/queries";
import { GET_REVIEWS_TAG } from "~/lib/sanity/tags";
import { type ReviewFormSchema } from "~/lib/utils/form-validators/review";

export async function createReview(
  data: Infer<typeof ReviewFormSchema> & { id: string }
) {
  await submitReview(data);
  revalidateTag(GET_REVIEWS_TAG);
}
