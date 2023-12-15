"use client";

import { addToCart } from "~/app/actions/cart";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

export function OrderButton({ id }: { id: string }) {
  const { toast } = useToast();

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
