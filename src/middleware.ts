import { authMiddleware } from "@clerk/nextjs";

import { env } from "~/env.mjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  // publicRoutes: ["/", "/contact"],
  publicRoutes: ["((?!^/admin/).*)"],
  // debug: env.NODE_ENV === "development",
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
