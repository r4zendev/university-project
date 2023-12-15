"use client";

import { NextStudio } from "next-sanity/studio";

import config from "~/sanity.config";

export default function AdminPage() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  return <NextStudio config={config as any} />;
}
