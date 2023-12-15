import { cookies } from "next/headers";
import { number, record, safeParse } from "valibot";

export const CART_COOKIE_NAME = "cart_cookie";
export const VIEWS_COOKIE_NAME = "recently_viewed";

type ArrayCookieFunctionReturn = { name: string; value: string[] | null };
type ObjectCookieFunctionReturn = {
  name: string;
  value: Record<string, number> | null;
};

export function getObjectCookie(
  cookieName: string,
): ObjectCookieFunctionReturn {
  const cookie = cookies().get(cookieName);

  if (!cookie) return { name: cookieName, value: null };

  try {
    const cartValue = safeParse(record(number()), JSON.parse(cookie.value));
    if (!cartValue.success) return { name: cookieName, value: null };

    return { name: cookie.name, value: cartValue.output };
  } catch (err) {
    return { name: cookieName, value: null };
  }
}

export function addToObjectCookie(
  cookieName: string,
  item: string,
): ObjectCookieFunctionReturn {
  const existingValue = getObjectCookie(cookieName);
  const newValue = {
    ...existingValue.value,
    [item]: existingValue.value?.[item] ? existingValue.value[item]! + 1 : 1,
  };
  const cookie = cookies()
    .set(cookieName, JSON.stringify(newValue))
    .get(cookieName);

  if (!cookie) {
    throw new Error("Could not set cookie");
  }

  return { name: cookie.name, value: newValue };
}

export function deleteFromObjectCookie(
  cookieName: string,
  item: string,
): ObjectCookieFunctionReturn {
  const existingValue = getObjectCookie(cookieName);
  if (!existingValue.value) return { name: cookieName, value: null };

  if (!existingValue.value[item]) return { name: cookieName, value: null };

  const decremented = existingValue.value[item]! - 1;
  const newValue: Record<string, number> = { ...existingValue.value };
  if (decremented === 0) {
    delete newValue[item];
  } else {
    newValue[item] = decremented;
  }

  const cookie = cookies()
    .set(cookieName, JSON.stringify(newValue))
    .get(cookieName);

  if (!cookie) {
    throw new Error("Could not delete from existing cookie");
  }

  return { name: cookie.name, value: newValue };
}

export function getArrayCookie(cookieName: string): ArrayCookieFunctionReturn {
  const cookie = cookies().get(cookieName);

  if (!cookie) return { name: cookieName, value: null };

  try {
    const cartValue = JSON.parse(cookie.value) as string[];

    return { name: cookie.name, value: cartValue };
  } catch (err) {
    return { name: cookieName, value: null };
  }
}

export function addToArrayCookie(
  cookieName: string,
  item: string,
  unshift = false,
): ArrayCookieFunctionReturn {
  const existingValue = getArrayCookie(cookieName);
  const newValue = [item];
  if (existingValue.value) {
    if (unshift) {
      newValue.unshift(item);
    } else {
      newValue.push(item);
    }
  }

  const cookie = cookies()
    .set(cookieName, JSON.stringify(newValue))
    .get(cookieName);

  if (!cookie) {
    throw new Error("Could not set cookie");
  }

  return { name: cookie.name, value: newValue };
}

export function deleteFromArrayCookie(
  cookieName: string,
  item: string,
): ArrayCookieFunctionReturn {
  const existingValue = getArrayCookie(cookieName);
  if (!existingValue.value) return { name: cookieName, value: null };

  const deletedIndex = existingValue.value.findIndex((i) => i === item);

  if (deletedIndex === -1) return { name: cookieName, value: null };

  const newValue = existingValue.value.toSpliced(deletedIndex, 1);
  const cookie = cookies()
    .set(cookieName, JSON.stringify(newValue))
    .get(cookieName);

  if (!cookie) {
    throw new Error("Could not delete from existing cookie");
  }

  return { name: cookie.name, value: newValue };
}

export const getCartCookie = () => getObjectCookie(CART_COOKIE_NAME);
export const addToCartCookie = (item: string) =>
  addToObjectCookie(CART_COOKIE_NAME, item);
export const deleteFromCartCookie = (item: string) =>
  deleteFromObjectCookie(CART_COOKIE_NAME, item);

export const getViewsCookie = () => getArrayCookie(VIEWS_COOKIE_NAME);
export const addToViewsCookie = (item: string) => {
  const { value: viewed } = getViewsCookie();
  if (viewed && viewed.length > 4) {
    deleteFromArrayCookie(VIEWS_COOKIE_NAME, viewed[0]!);
  }

  addToArrayCookie(VIEWS_COOKIE_NAME, item, true);
};
