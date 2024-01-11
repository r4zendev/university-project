import { format } from "date-fns";
import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { stripe } from "~/lib/stripe/client";
import { formatStripePrice } from "~/lib/utils";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: {
    payment_intent: string;
    payment_intent_client_secret: string;
    amountPaid: string;
    content: string;
    email: string;
    address: string;
  };
}) {
  const paymentIntentId = searchParams.payment_intent;
  if (!paymentIntentId) {
    return null;
  }
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    client_secret: searchParams.payment_intent_client_secret,
  });

  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4 md:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Checkout Successful</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Check className="mx-auto mb-4 h-12 w-12 text-green-500" />
          <p className="mb-4">
            Thank you for your purchase! Your order has been successfully processed.
          </p>
          <h2 className="mb-2 text-lg font-semibold">Order Details</h2>
          <div className="mb-1 flex justify-between">
            <span>Order ID:</span>
            <span className="font-medium">{paymentIntent.id}</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Total Amount:</span>
            <span className="font-medium">
              ${formatStripePrice(paymentIntent.amount)}
            </span>
          </div>
          <div className="mb-4 flex justify-between">
            <span>Order Date:</span>
            <span className="font-medium">
              {format(new Date(paymentIntent.created * 1000), "HH:mm MMMM dd, yyyy")}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="mt-4" variant="outline">
            <Link className="flex items-center gap-2" href="/">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
