import {
  email,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  optional,
  string,
} from "valibot";

export const ReviewFormSchema = object({
  title: string([minLength(3, "Please specify a longer title")]),
  rating: number([minValue(1), maxValue(5)]),
  content: string([minLength(10, "Please specify a review of meaningful length")]),
  email: string([email("Please specify a valid email address")]),
  username: optional(string()),
});
