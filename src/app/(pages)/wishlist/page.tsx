import { getItems } from "~/lib/sanity/queries";
import { getWishlistCookie } from "~/lib/utils/cookies";

export default async function Wishlist() {
  const { value: wishlist } = getWishlistCookie();
  if (!wishlist) return <p>Wishlist is empty</p>;
  const items = await getItems({
    ids: Object.keys(wishlist).map((key) => key.split(" ")[0]!),
  });

  return (
    <div>
      {items.map((item) => {
        return (
          <div key={`item-${item.name}`} className="xl:container">
            <p>{item.name}</p>
            <p>
              {item.discount ? (
                <span className="space-x-2 font-semibold text-primary">
                  <s className="text-red-400">{item.price}</s>
                  <span>{item.price}</span>
                </span>
              ) : (
                item.price
              )}
            </p>
            <p>{item.description}</p>
            <p>Quantity: {wishlist[item._id]}</p>
          </div>
        );
      })}
    </div>
  );
}
