import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemas } from "~/lib/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  projectId,
  dataset,
  title: "Jewelry Store",
  basePath: "/admin",
  plugins: [deskTool()],
  schema: { types: schemas },
});
