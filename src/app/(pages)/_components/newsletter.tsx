"use client";

import { useState } from "react";

import { subscribeToNewsLetter } from "~/actions/news";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";

export const SubscribeNewsletter = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  return (
    <div role="form" className="space-y-4 border-y py-12 text-center">
      <h5 className="font-mono text-3xl uppercase">Subscribe to our newsletter</h5>

      <div className="mx-auto flex w-1/3">
        <Input
          className="rounded-r-none border-r-0 transition-colors focus-visible:border-gray-800 focus-visible:ring-0"
          placeholder="Enter your email"
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          className="rounded-l-none"
          type="submit"
          onClick={async () => {
            if (!email) {
              return toast({
                title: "Please enter your email",
                variant: "destructive",
              });
            }
            try {
              const { message } = await subscribeToNewsLetter(email);
              if (message === "OK") {
                return toast({
                  title: "Thank you for subscribing!",
                  variant: "success",
                });
              }
              if (message === "ALREADY_SUBBED") {
                return toast({
                  title: "You are already subscribed!",
                });
              }
            } catch (err) {
              return toast({
                title: "Oh no!",
                description:
                  "There was an error subscribing you. Please try again later.",
                variant: "destructive",
              });
            }
          }}
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
};
