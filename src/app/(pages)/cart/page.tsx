import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DragFreeCarousel } from "~/components/carousels/basic";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getItems, getSettings, getTrendingItems } from "~/lib/sanity/queries";
import { type Item } from "~/lib/sanity/types";
import { stripeApi } from "~/lib/stripe/client";
import { formatPrice, formatStripePrice } from "~/lib/utils";
import { getCartCookie } from "~/lib/utils/cookies";
import { PaymentElementWrapper } from "./_components/payment-element";
import { ProductCountButton } from "./_components/product-count-button";

export default async function Cart() {
  const { value: cart } = getCartCookie();
  const settings = await getSettings();

  let otherRecommendedProducts: Item[] = [];
  if (settings) {
    if (settings.enableForYou) {
      otherRecommendedProducts = await getTrendingItems();
    }
  } else {
    otherRecommendedProducts = await getTrendingItems();
  }

  if (!cart) {
    return (
      <div className="flex min-h-[40rem] items-center justify-center">
        No items in cart yet :(
      </div>
    );
  }

  const items = await getItems({
    ids: Object.keys(cart).map((id) => id.split("(")[0]?.trim()) as string[],
  });

  const amount = items.reduce((acc, item) => {
    const matchedKey = Object.keys(cart).find((key) => key.startsWith(item._id));
    const itemCount = matchedKey ? cart[matchedKey] : 0;

    if (!itemCount) {
      return acc;
    }

    return (
      acc +
      (item.discount ? item.discountedPrice ?? item.price : item.price) * itemCount
    );
  }, 0);

  const stripeAmount = Math.floor(amount * 100);

  const { client_secret: clientSecret } = await stripeApi.paymentIntents.create({
    amount: stripeAmount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return (
    <div>
      <div className="container my-6 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-semibold">Confirm your order</h1>

          <div className="grid gap-4">
            {Object.entries(cart).map(([cookieTag, itemAmount]) => {
              const item = items.find(
                (item) => item._id === cookieTag.split("(")[0]?.trim()
              );

              if (!item) {
                return null;
              }

              const itemModifiers = "(" + cookieTag.split("(", 2).at(-1);

              return (
                <Card key={item._id}>
                  <CardContent className="flex h-full justify-between gap-4 p-4 sm:items-start">
                    <div className="space-y-4">
                      <Image
                        alt="Product Image"
                        className="h-20 w-20 rounded-md object-cover"
                        width={80}
                        height={80}
                        src={item.images[0] ?? "/placeholder.webp"}
                        style={{
                          aspectRatio: "80/80",
                          objectFit: "cover",
                        }}
                      />
                      <div className="grid flex-1 gap-1">
                        <Link className="text-lg font-medium hover:underline" href="#">
                          {item.name} {itemModifiers}
                        </Link>

                        <p className="text-gray-500">
                          Price:{" "}
                          {item.discount && item.discountedPrice ? (
                            <span className="space-x-2 font-semibold text-primary">
                              <s className="text-red-400">
                                {formatPrice(item.price * itemAmount, true)}
                              </s>
                              <span>
                                {formatPrice(item.discountedPrice * itemAmount, true)}
                              </span>
                            </span>
                          ) : (
                            <span className="font-semibold text-primary">
                              {formatPrice(item.price * itemAmount, true)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex h-full flex-col-reverse items-end justify-between">
                      <ProductCountButton cart={cart} tag={cookieTag} />

                      <Button className="w-12" variant="destructive">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <PaymentElementWrapper
          clientSecret={clientSecret}
          settings={settings}
          amount={formatStripePrice(stripeAmount)}
          cartItems={items}
          cart={cart}
        />
      </div>

      <div className="mx-auto w-3/4">
        {otherRecommendedProducts.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h4>

            <DragFreeCarousel items={otherRecommendedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
