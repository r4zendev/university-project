export const SOCIAL_PROVIDERS = [
  "facebook",
  "instagram",
  "pinterest",
  "twitter",
  "youtube",
] as const;
export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];
