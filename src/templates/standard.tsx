import {
  Body,
  Button,
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
import { marked } from "marked";

import type { Email } from "~/lib/sanity/types";

export type StandardTemplateProps = Email & {
  name: string | null;
  productName: string;
};

export function EmailTemplate({
  content,
  link,
  subject,
  name,
  productName,
}: StandardTemplateProps) {
  return (
    <Html lang="en">
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
        <title>{subject}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css"></style>
      </Head>

      {/* <MailContent {...props} /> */}
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
        <Preview>{subject}</Preview>

        <Body className="bg-gray-200 pt-12">
          <Container className="border-y-2 border-solid border-gray-400 bg-white px-6">
            <Heading>{subject}</Heading>

            <Text>Hey{name ? `, ${name}` : " there"}!</Text>

            <Section>
              <div dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
            </Section>

            {link && (
              <Section className="text-center">
                <Button
                  href={link}
                  className="mx-auto my-6 rounded-lg bg-primary px-8 py-3 text-center text-lg text-primary-foreground"
                >
                  Go to {productName}
                </Button>
              </Section>
            )}
          </Container>

          <Text className="my-8 text-center text-slate-500">
            &copy; {productName}. All rights reserved.
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
