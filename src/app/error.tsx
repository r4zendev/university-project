"use client";

import type { ErrorComponent } from "next/dist/client/components/error-boundary";
import { useRouter } from "next/navigation";

const ErrorBoundary: ErrorComponent = ({ error, reset: _ }) => {
  const router = useRouter();
  if (error.message === "UNAUTHORIZED") {
    router.push("/login");
  }

  return <div>{error.message}</div>;
};

export default ErrorBoundary;
