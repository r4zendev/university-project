import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Facebook,
  Instagram,
  ShoppingCart,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { MetalsWidget } from "~/components/metals";
import { getNavLinks, getSocialLinks } from "~/lib/sanity/queries";
import { type SocialProvider } from "~/lib/types";
import { getCartCookie } from "~/lib/utils/cookies";
import { MainNav } from "./_components/main-nav";
import { ProductsNavigation } from "./_components/products-navigation";
import { Search } from "./_components/search";

import "~/styles/globals.css";

export const metadata = {
  title: "Silverstone | Front Page",
  description: "Buy the best jewelry in the world",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-icon", url: "/apple-touch-icon.png" },
  ],
};

const navigation = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Status", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Claim", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

const providerToImageMapper: Record<SocialProvider, ReactNode> = {
  instagram: <Instagram />,
  facebook: <Facebook />,
  youtube: <Youtube />,
  twitter: <Twitter />,
  pinterest: (
    <svg
      className="hover:fill-accent"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      height="24px"
      width="24px"
      version="1.1"
      id="Capa_1"
      viewBox="0 0 480.666 480.666"
      xmlSpace="preserve"
    >
      <g id="pinterest_2_">
        <g>
          <path d="M240.35,0.008C107.612,0.008,0,107.605,0,240.31c0,98.431,59.168,182.967,143.867,220.133    c-0.717-16.795-0.157-36.918,4.145-55.17c4.646-19.522,30.957-130.976,30.957-130.976s-7.669-15.345-7.669-38.009    c0-35.623,20.637-62.215,46.323-62.215c21.885,0,32.421,16.429,32.421,36.076c0,21.962-13.996,54.85-21.198,85.283    c-6.016,25.5,12.781,46.301,37.907,46.301c45.545,0,76.221-58.506,76.221-127.781c0-52.66-35.478-92.087-100.006-92.087    c-72.916,0-118.305,54.359-118.305,115.077c0,20.949,6.142,35.702,15.837,47.127c4.428,5.268,5.051,7.388,3.43,13.405    c-1.154,4.427-3.773,15.072-4.895,19.28c-1.592,6.096-6.516,8.262-12.033,6.033c-33.573-13.733-49.192-50.471-49.192-91.814    c0-68.279,57.578-150.125,171.736-150.125c91.773,0,152.189,66.377,152.189,137.654c0,94.277-52.434,164.723-129.713,164.723    c-25.937,0-50.346-14.045-58.701-29.975c0,0-13.965,55.389-16.894,66.065c-5.113,18.517-15.089,37.058-24.193,51.491    c21.605,6.375,44.454,9.85,68.116,9.85c132.736,0,240.316-107.595,240.316-240.348C480.666,107.605,373.086,0.008,240.35,0.008z" />
        </g>
      </g>
    </svg>
  ),
};

function UserAuthButtons() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <SignInButton />
      </SignedOut>
    </>
  );
}

export default async function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const productsNavLinks = await getNavLinks("products");
  const socialLinks = await getSocialLinks();
  const { value: cart } = getCartCookie();
  const cartLength = cart ? Object.keys(cart).length : 0;

  return (
    <div>
      <header className="border-b">
        <div className="flex h-16 items-center px-4 xl:container">
          <Link href="/">
            <Image src="/logo-large.png" alt="logo" width={100} height={80} />
          </Link>

          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />

            <UserAuthButtons />

            <Link href="/cart" className="relative">
              <ShoppingCart />
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-semibold text-white bg-red-500 rounded-full px-1">
                  {cartLength}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <ProductsNavigation links={productsNavLinks} />

      <main className="xl:container">
        {modal}

        {children}
      </main>

      <footer className="bg-white" aria-labelledby="footer-heading">
        <div className="xl:container">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Solutions
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.solutions.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Support
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.support.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Company
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.company.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Legal
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {navigation.legal.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <MetalsWidget />
            </div>
            <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
              <div className="flex space-x-6 md:order-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.provider}
                    href={item.url}
                    className="text-gray-400 hover:text-gray-500 h-4 w-4"
                  >
                    <span className="sr-only">{item.provider}</span>
                    {providerToImageMapper[item.provider]}
                  </a>
                ))}
              </div>
              <p className="mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
                &copy; 2023 SilverStone, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
