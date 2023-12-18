import { twMerge, type ClassNameValue } from "tailwind-merge";

export const cn = (...inputs: ClassNameValue[]) => {
  return twMerge(inputs);
};

export const formatPrice = (price: number | undefined, floor = false) => {
  if (price === undefined) {
    return "?";
  }

  if (floor) {
    return `$${(Math.floor(price * 100) / 100).toFixed(2)}`;
  }

  return `$${price.toFixed(2)}`;
};

export const formatStripePrice = (price: number) => {
  const amount = price / 100;
  const [dollars, cents] = amount.toString().split(".");
  return `${dollars}.${cents!.padEnd(2, "0")}`;
};
