import { getAllTags, getItems, type ItemSortOptions } from "~/lib/sanity/queries";
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
  const priceTags = await getAllTags("Price");
  const parsedPriceRanges = priceTags
    .reduce(
      (acc, tag) => [
        ...acc,
        tag.value.split("-").map((n) => Number(n.match(/[0-9]+/)?.at(0))),
      ],
      [] as number[][]
    )
    .filter(([a, b]) => a !== undefined && b !== undefined)
    .sort((a, b) => a[0]! - b[0]!);

  const products = await getItems({
    category,
    ...(sort && { sort: sort as ItemSortOptions }),
  });

  const tagsWithCounts = products.reduce((acc, product) => {
    const productPrice = product.discountedPrice ?? product.price;
    const priceRange = parsedPriceRanges.find(
      ([min, max]) => productPrice >= min! && productPrice <= max!
    );

    const priceTag = priceTags.find((tag) =>
      tag.value.includes(`${priceRange?.[0]}-${priceRange?.[1]}`)
    );

    if (priceTag?.value) {
      if (!product.tags) {
        product.tags = [];
      }
      product.tags?.push({
        name: "Price",
        value: priceTag.value,
      } as NonNullable<(typeof product)["tags"]>[number]);
    }

    product.tags?.forEach((tag) => {
      const { name, ...tagRest } = tag;

      const restData = { ...tagRest, count: 1 };
      if (acc[name]) {
        const existing = acc[name]!.find((t) => t.value === tagRest.value);
        if (existing) {
          existing.count++;
          return acc;
        }

        acc[name]!.push(restData);
      } else {
        acc[name] = [restData];
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
    // TODO: Banners

    <ProductsWithFilter
      category={category}
      products={filteredProducts}
      tags={tagsWithCounts}
    />
  );
}
