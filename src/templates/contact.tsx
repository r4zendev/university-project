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
} from "@react-email/components";
import type { Metadata } from "next";

import { Card, CardContent } from "~/components/ui/card";

export type ContactUs = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export const metadata: Metadata = {
  title: "Silverstone | Contact Us",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-icon", url: "/apple-touch-icon.png" },
  ],
};

export function ContactTemplate({ email, message, name, phone, subject }: ContactUs) {
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
          <title>New contact request</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style type="text/css"></style>
        </Head>

        <Preview>Someone contacted you</Preview>

        <Body className="bg-gray-200 pt-12">
          <Container className="border-y-2 border-solid border-gray-400 bg-white px-6">
            <Heading>{subject}</Heading>

            <Section>
              <main className="flex h-screen flex-col items-center justify-center bg-gray-100 p-4 md:p-8">
                <p>
                  Request by: {email} ({name})
                </p>
                {phone && <p>Phone: {phone}</p>}

                <div>
                  <Card>
                    <CardContent>
                      <p className="text-lg font-bold">Message</p>
                      <p>{message}</p>
                    </CardContent>
                  </Card>
                </div>
              </main>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
