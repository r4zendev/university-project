import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest, NextResponse } from "next/server";

import { env } from "~/env.mjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
const middleware = async (req: NextRequest): Promise<NextResponse<unknown>> => {
  const url = req.nextUrl;

  return authMiddleware({
    // publicRoutes: ["/", "/contact"],
    publicRoutes: ["((?!^/admin/).*)"],
    // debug: env.NODE_ENV === "development",
  });
};

export default middleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
