"use server";

import { clerkClient } from "@clerk/nextjs";
import { Resend } from "resend";

import { env } from "~/env.mjs";
import { getSettings, type createOrder } from "~/lib/sanity/queries";
import { type Email } from "~/lib/sanity/types";
import { OrderTemplate } from "~/templates/order";
import { EmailTemplate } from "~/templates/standard";

export async function sendNewsletter(props: Email & { host: string }) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { host, ...restProps } = props;
  const settings = await getSettings();

  if (!settings) {
    throw new Error("Please add settings to Sanity.");
  }

  try {
    const sent = new Set<string>();
    let page = 0;

    while (true) {
      page += 1;

      const users = await clerkClient.users.getUserList({
        limit: 100,
        offset: (page - 1) * 100,
      });

      if (users.length === 0) {
        break;
      }

      await Promise.allSettled(
        users.map(async (user) => {
          const userEmail = user.emailAddresses[0]?.emailAddress;
          if (!user.privateMetadata.newsletter || !userEmail) {
            return Promise.resolve();
          }
          if (sent.has(userEmail)) {
            return Promise.resolve();
          }

          try {
            const from =
              env.NODE_ENV === "development"
                ? "Development <newsletter@r4zen.dev>"
                : `Newsletter <newsletter@${host}>`;

            const link =
              env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : `https://${host}`;

            const { data, error } = await resend.emails.send({
              from: from ?? "newsletter@jewellery.dev",
              to: userEmail,
              subject: restProps.subject,
              react: EmailTemplate({
                ...restProps,
                name: user.firstName ?? user.username,
                productName: settings.productName,
                link,
              }),
            });

            if (error) {
              return { error };
            }

            return { id: data?.id };
          } catch (error) {
            console.log(error);
            return { error };
          }
        })
      );
    }

    return new Response("Email sent", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response((err as Error).message, { status: 500 });
  }
}

export async function sendOrderConfirmed(
  props: Parameters<typeof createOrder>[0] & { email: string; host: string }
) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const settings = await getSettings();

  if (!settings) {
    throw new Error("Please add settings to Sanity.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email, host, ...orderData } = props;

  const from =
    env.NODE_ENV === "development"
      ? "Development <noreply@r4zen.dev>"
      : `Newsletter <noreply@${host}>`;

  try {
    await resend.emails.send({
      from: from ?? "noreply@jewellery.dev",
      to: email,
      subject: "Order confirmed",
      react: OrderTemplate({ ...orderData, productName: settings.productName }),
    });
  } catch (err) {
    console.error(err);
    // return new Response((err as Error).message, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: from ?? "noreply@jewellery.dev",
      to: env.ADMIN_EMAIL,
      subject: "New order by a customer",
      react: OrderTemplate({ ...orderData, productName: settings.productName }),
    });
  } catch (err) {
    console.error(err);
    // return new Response((err as Error).message, { status: 500 });
  }
}
