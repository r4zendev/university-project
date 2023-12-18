import { getItems, type ItemSortOptions } from "~/lib/sanity/queries";
import { ProductsWithFilter } from "./_components/products";
import type { TagsWithCounts } from "./_components/types";

export default async function ProductsPage({
  params: { category },
  searchParams,
}: {
  params: { category: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { filter, sort } = searchParams;
  const parsedFilters = JSON.parse((filter as string) ?? "{}") as Record<
    string,
    string[]
  >;

  const products = await getItems({
    category,
    // ...(filter && { tags: parsedFilters }),
    ...(sort && { sort: sort as ItemSortOptions }),
  });

  const matchedPairs: { name: string; value: string }[] = [];
  const tagsWithCounts = products.reduce((acc, product) => {
    product.tags?.forEach((tag) => {
      const { name, ...tagRest } = tag;
      if (
        acc[name] &&
        !matchedPairs.find((pair) => pair.name === name && pair.value === tagRest.value)
      ) {
        acc[name]!.push(tagRest);
      } else {
        matchedPairs.push({ name, value: tagRest.value });
        acc[name] = [tagRest];
      }
    });

    return acc;
  }, {} as TagsWithCounts);

  const filteredProducts =
    Object.keys(parsedFilters).length > 0
      ? products.filter(
          (prod) =>
            prod.tags &&
            Object.entries(parsedFilters).every(
              ([filterTagName, filterArrayOfValues]) =>
                filterArrayOfValues.some((filterValue) =>
                  prod.tags!.find(
                    (tag) =>
                      tag.name === filterTagName && filterValue.includes(tag.value)
                  )
                )
            )
        )
      : products;

  return (
    // Banners
    <ProductsWithFilter products={filteredProducts} tags={tagsWithCounts} />
  );
}
