"use client";

import { Minus, Plus } from "lucide-react";

import { addToCart, removeFromCart } from "~/actions/cart";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/use-toast";
import type { getCartCookie } from "~/lib/utils/cookies";

export const ProductCountButton = ({
  cart,
  tag,
}: {
  cart: NonNullable<ReturnType<typeof getCartCookie>["value"]>;
  tag: string;
}) => {
  return (
    <div className="flex flex-nowrap items-center gap-2 text-center">
      <Button
        variant="none"
        onClick={async () => {
          await addToCart(tag);

          toast({
            title: "Added one more",
            description: "One more unit of the same item has been added to the cart",
            variant: "success",
          });
        }}
      >
        <Plus className="h-3 w-3 text-primary" />
      </Button>

      <span className="text-md font-medium">{cart[tag]}</span>

      <Button
        variant="none"
        disabled={cart[tag] === 1}
        onClick={async () => {
          await removeFromCart(tag);

          toast({
            title: "Removed from cart",
            description: "Item has been removed from the cart",
            variant: "success",
          });
        }}
      >
        <Minus className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
};
