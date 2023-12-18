/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options & import('@ianvs/prettier-plugin-sort-imports').PrettierConfig} */
const config = {
  tabWidth: 2,
  endOfLine: "lf",
  semi: true,
  printWidth: 88,
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSameLine: false,
  trailingComma: "es5",
  useTabs: false,
  bracketSpacing: true,
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
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};

export default config;
