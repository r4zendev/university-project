import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Check } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";
import type { createOrder } from "~/lib/sanity/queries";
import { formatPrice } from "~/lib/utils";

export function OrderTemplate({
  address,
  amountPaid,
  content,
  productName,
}: Omit<Parameters<typeof createOrder>[0], "email"> & {
  productName: string;
}) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#4bd2b7",
                "primary-foreground": "#262626",
              },
            },
          },
        }}
      >
        <Head>
          <Font
            fontFamily="Source Sans Pro"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff",
              format: "woff",
            }}
            fontStyle="normal"
            fontWeight={400}
          />
          <Font
            fontFamily="Source Sans Pro"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff",
              format: "woff",
            }}
            fontStyle="normal"
            fontWeight={700}
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <title>Order placed</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style type="text/css"></style>
        </Head>

        {/* <MailContent {...props} /> */}
        <Preview>Order placed! Thank you</Preview>

        <Body className="bg-gray-200 pt-12">
          <Container className="border-y-2 border-solid border-gray-400 bg-white px-6">
            <Heading>Order placed!</Heading>

            <Text>Hello, dear customer!</Text>

            <Section>
              <main className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4 md:p-8">
                <Card className="w-full max-w-lg">
                  <CardContent className="text-center">
                    <Check className="mx-auto mb-4 h-12 w-12 text-green-500" />
                    <p className="mb-4">
                      Thank you for your purchase! Your order has been successfully
                      processed.
                    </p>
                    <h2 className="mb-2 text-lg font-semibold">Order Details</h2>
                    <div className="mb-1 flex justify-between">
                      <span>Total Amount: </span>
                      <span className="font-medium">{formatPrice(amountPaid)}</span>
                    </div>
                    <div className="mb-4 flex justify-between">
                      <span>It will be shipped to: </span>
                      <span className="font-medium">{address}</span>
                    </div>
                    <div className="mb-4 flex justify-between text-left">
                      <span>Items you have ordered: </span>
                      <div>{content}</div>
                    </div>
                  </CardContent>
                </Card>
              </main>
            </Section>
          </Container>

          <Text className="my-8 text-center text-slate-500">
            &copy; {productName}. All rights reserved.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
