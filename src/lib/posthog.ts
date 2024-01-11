import { PostHog } from "posthog-node";

import { env } from "~/env.mjs";

let posthogClient: PostHog | undefined;

(() => {
  if (env.POSTHOG_API_KEY) {
    posthogClient = new PostHog(env.POSTHOG_API_KEY);
  }
})();

export const sendEvent = (...args: Parameters<PostHog["capture"]>) => {
  if (!posthogClient) {
    return;
  }

  posthogClient.capture(...args);

  // Send queued events immediately. Use for example in a serverless environment
  // where the program may terminate before everything is sent
  posthogClient.flush();
};
