import { getItems } from "~/lib/sanity/queries";

export default async function ProductsList() {
  const allProducts = await getItems();

  return (
    <div className="flex">
      <aside className="w-1/4">{/* <Filters /> */}</aside>
      <div className="flex-1"></div>
    </div>
  );
}
