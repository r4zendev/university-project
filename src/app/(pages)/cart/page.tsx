import { getItems } from "~/lib/sanity/queries";
import { getCartFromCookie } from "~/lib/utils/cart";

export default async function Cart() {
  const cartCookie = getCartFromCookie();
  if (!cartCookie) return <p>Cart is empty</p>;
  const items = await getItems({ ids: cartCookie.cart });

  return (
    <div>
      {items.map((item) => {
        return (
          <div key={`item-${item.name}`} className="xl:container">
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>{item.discountedPrice}</p>
            <p>{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
