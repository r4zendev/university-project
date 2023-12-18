import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DragFreeItemsCarousel } from "~/components/carousel";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getItems, getSettings, getTrendingItems } from "~/lib/sanity/queries";
import { type Item } from "~/lib/sanity/types";
import { stripeApi } from "~/lib/stripe/client";
import { formatPrice, formatStripePrice } from "~/lib/utils";
import { getCartCookie } from "~/lib/utils/cookies";
import { PaymentElementWrapper } from "./_components/payment-element";

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
      <div className="my-6 flex gap-4">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>

          <div className="grid gap-4">
            {items.map((item) => (
              <Card key={item._id}>
                <CardContent className="flex items-start gap-4 p-4">
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
                      Product Name
                    </Link>
                    <p className="text-gray-500">
                      Quantity: <Badge>2</Badge>
                    </p>
                    <p className="text-gray-500">
                      Price:{" "}
                      {item.discount ? (
                        <span className="space-x-2 font-semibold text-primary">
                          <s className="text-red-400">
                            {formatPrice(item.price, true)}
                          </s>
                          <span>{formatPrice(item.discountedPrice, true)}</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-primary">
                          {formatPrice(item.price, true)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button className="w-12" variant="destructive">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <PaymentElementWrapper
          clientSecret={clientSecret}
          settings={settings}
          amount={formatStripePrice(stripeAmount)}
        />
      </div>

      <div className="mx-auto w-3/4">
        {otherRecommendedProducts.length > 0 && (
          <div className="mt-4 flex w-full flex-col items-center justify-center">
            <h4 className="text-2xl font-bold uppercase tracking-tight">
              You may also like
            </h4>

            <DragFreeItemsCarousel slides={otherRecommendedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
