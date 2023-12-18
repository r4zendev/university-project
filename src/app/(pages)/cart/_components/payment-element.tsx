"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, type FormEventHandler } from "react";

import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";
import type { Settings } from "~/lib/sanity/types";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const PaymentElementWrapper = ({
  clientSecret,
  settings,
  amount,
}: {
  clientSecret: string | null;
  settings: Settings | null;
  amount: string;
}) => {
  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      options={{ clientSecret, appearance: { theme: "stripe" } }}
      stripe={stripePromise}
    >
      <CheckoutForm settings={settings} amount={amount} />
    </Elements>
  );
};

function CheckoutForm({
  settings,
  amount,
}: {
  settings: Settings | null;
  amount: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/checkout/success" },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? null);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="px-6 py-4">
      <PaymentElement
        id="payment-element"
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
  );
}
