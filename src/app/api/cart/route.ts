import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { getCartFromCookie } from "~/lib/utils/cart";

const handler = async (req: NextRequest) => {
  const { id } = (await req.json()) as {
    id: string;
  };

  // eslint-disable-next-line prefer-const
  const cartCookie = getCartFromCookie();
  let value = "";
  let cookieName = "";
  if (!cartCookie) {
    cookieName = "cart_cookie";
    value = id;
  } else {
    cookieName = cartCookie.cookieName;
    value =
      cartCookie.cart.join(", ") + `${cartCookie.cart.length ? ", " : ""}${id}`;
  }

  cookies().set(cookieName, value);

  return NextResponse.json({ cookieName });
};

export { handler as GET, handler as POST };
