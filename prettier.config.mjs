/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options & import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  importOrder: [
    "^dotenv",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/(.*)$",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  importOrderParserPlugins: [
    "typescript",
    "jsx",
    "classProperties",
    "decorators-legacy",
  ],
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
};

export default config;
