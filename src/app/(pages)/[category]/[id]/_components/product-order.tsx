"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

import { addToCart, removeFromCart } from "~/actions/cart";
import { addToWishlist } from "~/actions/wishlist";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useToast } from "~/components/ui/use-toast";
import type { Item } from "~/lib/sanity/types";
import { cn, formatPrice } from "~/lib/utils";
import type { getCartCookie } from "~/lib/utils/cookies";

const SelectOptions = ({
  tagName,
  values,
  selected,
  setSelected,
}: {
  tagName: string;
  values: string[];
  selected: Record<string, string>;
  setSelected: Dispatch<SetStateAction<Record<string, string>>>;
}) => {
  if (tagName === "Sizes") {
    return (
      <ul className="grid grid-cols-4 gap-2">
        {values.map((value) => (
          <li key={value}>
            <Button
              variant="secondary"
              className={cn(
                "w-14 font-medium",
                selected[tagName] === value &&
                  "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              onClick={() => {
                setSelected((prev) => ({
                  ...prev,
                  [tagName]: value,
                }));
              }}
            >
              {value}
            </Button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul>
      <RadioGroup
        value={selected[tagName]}
        onValueChange={(value) => {
          // eslint-disable-next-line
          if (value) {
            setSelected((prev) => ({
              ...prev,
              [tagName]: value,
            }));
          }
        }}
      >
        {values.map((value) => (
          <div className="flex items-center space-x-2" key={value}>
            <RadioGroupItem value={value} id={`${tagName}-${value}`} />
            <Label htmlFor={`${tagName}-${value}`}>{value}</Label>
          </div>
        ))}
      </RadioGroup>
    </ul>
  );
};

export const TagsSelection = ({
  tags,
  selected,
  setSelected,
}: {
  tags: Record<string, string[]>;
  selected: Record<string, string>;
  setSelected: Dispatch<SetStateAction<Record<string, string>>>;
}) => {
  return (
    <div>
      {Object.entries(tags).map(([name, values]) => (
        <div key={name}>
          <p className="font-bold">
            {name}:{selected[name]}
          </p>

          <SelectOptions
            tagName={name}
            values={values}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      ))}
    </div>
  );
};

type OrderItemProps = {
  id: string;
  cart: ReturnType<typeof getCartCookie>["value"];
  tags: Record<string, string[]>;
};

export const OrderButton = ({
  id,
  cart,
  tags,
  disabled,
  className,
}: { className?: string; disabled?: boolean } & OrderItemProps) => {
  const { toast } = useToast();

  if (!cart?.[id]) {
    return (
      <Button
        className={className}
        disabled={disabled}
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

  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
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
        <Plus className="h-3 w-3 text-primary" />
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
        <Minus className="h-3 w-3 text-destructive" />
      </Button>
    </div>
  );
};

export const ProductOrder = ({
  id,
  cart,
  tags,
  product,
}: { product: Item } & OrderItemProps) => {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { toast } = useToast();

  return (
    <>
      {product.discount ? (
        <p className="my-2 space-x-2">
          <s className="font-medium text-destructive">{formatPrice(product.price)}</s>
          <span className="font-medium">{formatPrice(product.discountedPrice)}</span>
        </p>
      ) : null}

      {/* TODO: Product rating stars */}

      <TagsSelection tags={tags} selected={selected} setSelected={setSelected} />

      <OrderButton
        id={selected ? `${id} (${Object.values(selected).join(",")})` : id}
        disabled={Object.keys(selected).length !== Object.keys(tags).length}
        cart={cart}
        tags={tags}
        className="my-4 w-full"
      />

      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 text-sm font-semibold underline"
        onClick={async () => {
          await addToWishlist(id);
          toast({
            title: "Added to Wishlist",
            description: "Item has been added to the Wishlist",
            variant: "success",
          });
        }}
      >
        <ShoppingBag className="h-4 w-4" />
        <p>Add to Wishlist</p>
      </div>
    </>
  );
};
