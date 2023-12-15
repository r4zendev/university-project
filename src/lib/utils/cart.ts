import { cookies } from "next/headers";

export function getCartFromCookie(): {
  cookieName: string;
  cart: string[];
} | null {
  const cart = cookies()
    .getAll()
    .find((cookie) => cookie.name.startsWith("cart"));

  if (!cart) return null;

  return {
    cookieName: cart.name,
    cart: cart.value.split(", "),
  };
}
