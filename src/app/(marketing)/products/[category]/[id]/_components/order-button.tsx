"use client";

import { Minus, Plus } from "lucide-react";

import { addToCart, removeFromCart } from "~/app/actions/cart";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import type { getCartCookie } from "~/lib/utils/cookies";

export function OrderButton({
  id,
  cart,
}: {
  id: string;
  cart: ReturnType<typeof getCartCookie>["value"];
}) {
  const { toast } = useToast();

  if (cart?.[id]) {
    return (
      <div className="flex gap-2 items-center">
        <Button
          variant="none"
          onClick={async () => {
            await addToCart(id);

            toast({
              title: "Added to cart",
              description: "Item has been added to the cart",
              variant: "success",
            });
          }}
        >
          <Plus className="w-3 h-3 text-primary" />
        </Button>

        <p>{cart[id]}</p>

        <Button
          variant="none"
          onClick={async () => {
            await removeFromCart(id);

            toast({
              title: "Removed from cart",
              description: "Item has been removed from the cart",
              variant: "success",
            });
          }}
        >
          <Minus className="w-3 h-3 text-destructive" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={async () => {
        await addToCart(id);

        toast({
          title: "Added to cart",
          description: "Your item has been added to the cart",
          variant: "success",
        });
      }}
    >
      Add to cart
    </Button>
  );
}
