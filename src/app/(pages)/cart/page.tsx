import { getItems } from "~/lib/sanity/queries";
import { getCartCookie } from "~/lib/utils/cookies";

export default async function Cart() {
  const { value: cart } = getCartCookie();
  if (!cart) return <p>Cart is empty</p>;
  const items = await getItems({ ids: Object.keys(cart) });

  return (
    <div>
      {items.map((item) => {
        return (
          <div key={`item-${item.name}`} className="xl:container">
            <p>{item.name}</p>
            <p>
              {item.discount ? (
                <span className="text-primary font-semibold space-x-2">
                  <s className="text-red-400">{item.price}</s>
                  <span>{item.price}</span>
                </span>
              ) : (
                item.price
              )}
            </p>
            <p>{item.description}</p>
            <p>Quantity: {cart[item._id]}</p>
          </div>
        );
      })}
    </div>
  );
}
