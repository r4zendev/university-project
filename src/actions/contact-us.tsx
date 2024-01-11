"use server";

import { Resend } from "resend";

import { env } from "~/env.mjs";
import { getSettings } from "~/lib/sanity/queries";
import { ContactTemplate, type ContactUs } from "~/templates/contact";

export async function contactAdministration(props: ContactUs & { host: string }) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const settings = await getSettings();

  if (!settings) {
    throw new Error("Please add settings to Sanity.");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { host, ...contactData } = props;

  const from =
    env.NODE_ENV === "development"
      ? "Development <noreply@r4zen.dev>"
      : `Newsletter <noreply@${host}>`;

  try {
    await resend.emails.send({
      from: from ?? "newsletter@jewellery.dev",
      to: env.ADMIN_EMAIL,
      subject: "New contact request",
      react: ContactTemplate(contactData),
    });
  } catch (err) {
    console.error(err);
    // return new Response((err as Error).message, { status: 500 });
  }
}
