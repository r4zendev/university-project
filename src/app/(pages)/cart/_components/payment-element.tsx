"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { useForm, type SubmitHandler } from "react-hook-form";
import { mergeRefs } from "react-merge-refs";
import { z } from "zod";

import { clearCart } from "~/actions/cart";
import { placeOrder } from "~/actions/place-order";
import { sendOrderConfirmed } from "~/actions/send-emails";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { env } from "~/env.mjs";
import type { Item, Settings } from "~/lib/sanity/types";
import { formatPrice } from "~/lib/utils";
import type { getCartCookie } from "~/lib/utils/cookies";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ZodOrderForm = z.object({
  email: z.string().email("Please enter a valid email"),
  city: z.string().min(1, "Please enter a valid city"),
  address: z.string().min(5, "Please enter a valid address"),
});

export const PaymentElementWrapper = ({
  clientSecret,
  settings,
  amount,
  cart,
  cartItems,
}: {
  clientSecret: string | null;
  settings: Settings | null;
  amount: string;
  cart: NonNullable<ReturnType<typeof getCartCookie>["value"]>;
  cartItems: Item[];
}) => {
  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      options={{ clientSecret, appearance: { theme: "stripe" } }}
      stripe={stripePromise}
    >
      <CheckoutForm
        settings={settings}
        amount={amount}
        cart={cart}
        cartItems={cartItems}
      />
    </Elements>
  );
};

function CheckoutForm({
  settings,
  amount,
  cart,
  cartItems,
}: {
  settings: Settings | null;
  amount: string;
  cart: NonNullable<ReturnType<typeof getCartCookie>["value"]>;
  cartItems: Item[];
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { ref: autoCompleteInputRef } = usePlacesWidget<HTMLInputElement>({
    apiKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const form = useForm({
    resolver: zodResolver(ZodOrderForm),
    defaultValues: {
      email: "",
      city: "",
      address: "",
    },
  });

  useEffect(() => {
    const getPaymentIntent = async () => {
      if (!stripe) {
        return;
      }

      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        return;
      }

      await stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
    };

    void getPaymentIntent();
  }, [stripe]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleStripeSubmit: SubmitHandler<z.infer<typeof ZodOrderForm>> = async (
    data
  ) => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await elements.submit();

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? null);
      } else {
        setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
      return;
    }

    const orderData = {
      amountPaid: Number(amount),
      content: Object.entries(cart)
        .map(([cookieTag, count]) => {
          const item = cartItems.find(
            (item) => item._id === cookieTag.split("(")[0]?.trim()
          );

          if (!item) {
            return null;
          }

          const [, modifiers] = cookieTag.split("(", 2);

          return `${item.name}${
            modifiers ? `(${modifiers}` : ""
          }: ${count} x ${formatPrice(item.price)}`;
        })
        .join("<br/>"),
      email: data.email,
      address: data.city + ", " + data.address,
    };

    await sendOrderConfirmed({ host: window.location.host, ...orderData });

    await placeOrder(orderData);

    await clearCart();

    await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/checkout/success" },
    });
  };

  return (
    <Form {...form}>
      <form id="payment-form" onSubmit={form.handleSubmit(handleStripeSubmit)}>
        <div className="mb-4 space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your email..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Location</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    ref={mergeRefs([field.ref, autoCompleteInputRef])}
                    id="city"
                    placeholder="Location"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Full address</FormLabel>
                <FormControl>
                  <Input {...field} id="address" placeholder="Address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <PaymentElement
          id="payment-element"
          className="!text-red-600"
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true,
            },
            ...(settings?.productName && {
              business: { name: settings?.productName },
            }),
          }}
        />

        <div className="mt-2 flex items-center justify-between">
          <Button
            disabled={isLoading || !stripe || !elements}
            isLoading={isLoading}
            id="submit"
          >
            Pay now
          </Button>

          <p className="text-sm font-semibold">Order total: ${amount}</p>
        </div>

        {message && (
          <div id="payment-message" className="font-medium text-destructive">
            {message}
          </div>
        )}
      </form>
    </Form>
  );
}
