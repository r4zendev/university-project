import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";

import { Toaster } from "~/app/_components/ui/toaster";
import { ContextProviders } from "~/lib/context";

import "~/styles/globals.css";

const supreme = localFont({
  src: [
    {
      path: "../../public/fonts/Supreme-Variable.woff2",
      weight: "100 800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Supreme-VariableItalic.woff2",
      weight: "100 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-supreme",
});

export const metadata = {
  title: "Silverstone | Front Page",
  description: "Buy the best jewelry in the world",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-icon", url: "/apple-touch-icon.png" },
  ],
};

export default function EmptyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${supreme.variable} bg-gradient-to-br from-secondary via-primary/60 to-primary`}
      >
        <ClerkProvider>
          <ContextProviders>
            <Toaster />
            {children}
          </ContextProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
