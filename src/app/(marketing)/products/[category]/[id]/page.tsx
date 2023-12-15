import Image from "next/image";
import { notFound } from "next/navigation";

import { clickItem, getItemById } from "~/lib/sanity/queries";
import { OrderButton } from "./_components/order-button";

export default async function Product({
  params: { id },
}: {
  params: { category: string; id: string };
}) {
  const product = await getItemById(id);

  if (!product) {
    return notFound();
  }

  // TODO: check if in viewed cookies, then don't click
  await clickItem(id);

  return (
    <div>
      <p>Product</p>
      <p>{product._id}</p>
      <p>{product._createdAt}</p>
      <Image
        src={product.image}
        alt={product.name ?? "Item"}
        width={500}
        height={500}
      />

      <OrderButton id={id} />
    </div>
  );
}
