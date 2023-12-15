import Image from "next/image";
import { notFound } from "next/navigation";

import { getItemById } from "~/lib/sanity/queries";
import { OrderButton } from "./_components/order-button";
import { ViewsIncrementer } from "./_components/views-incrementer";

export default async function Product({
  params: { id },
}: {
  params: { category: string; id: string };
}) {
  const product = await getItemById(id);

  if (!product) return null;

  if (!product) {
    return notFound();
  }

  return (
    <>
      <ViewsIncrementer id={id} />

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
    </>
  );
}
