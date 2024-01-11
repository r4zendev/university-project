import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Facebook,
  Heart,
  Instagram,
  ShoppingCart,
  Twitter,
  Youtube,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { HeaderCarousel } from "~/components/carousels/header";
import { MetalsWidget } from "~/components/metals";
import {
  getNavLinks,
  getSettings,
  getSocialLinks,
  getTopScrollBanners,
} from "~/lib/sanity/queries";
import { type HeaderBanner } from "~/lib/sanity/types";
import { type SocialProvider } from "~/lib/types";
import { getCartCookie, getWishlistCookie } from "~/lib/utils/cookies";
import { SubscribeNewsletter } from "./_components/newsletter";
import { ProductsNavigation } from "./_components/products-navigation";
import { Search } from "./_components/search";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Silverstone | Front Page",
  description: "Buy the best jewelry in the world",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-icon", url: "/apple-touch-icon.png" },
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
  const footerNavLinks = await getNavLinks("footer");
  const socialLinks = await getSocialLinks();
  const settings = await getSettings();
  let topScrollTexts: HeaderBanner[] = [];
  if (settings) {
    if (settings.enableHeaderBanners) {
      topScrollTexts = await getTopScrollBanners();
    }
  } else {
    topScrollTexts = await getTopScrollBanners();
  }

  const { value: cart } = getCartCookie();
  const cartLength = cart ? Object.values(cart).reduce((acc, val) => acc + val, 0) : 0;

  const { value: wishlist } = getWishlistCookie();
  const wishListLength = wishlist
    ? Object.values(wishlist).reduce((acc, val) => acc + val, 0)
    : 0;

  return (
    <div>
      <header className="border-b">
        {topScrollTexts.length > 0 && <HeaderCarousel items={topScrollTexts} />}

        <div className="flex h-16 items-center px-4">
          <Link href="/">
            <Image src="/logo-large.png" alt="logo" width={100} height={80} />
          </Link>

          <div className="ml-auto flex items-center space-x-4">
            <Search />

            <Link href="/wishlist" className="relative">
              <Heart />
              {wishListLength > 0 && (
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 px-1 text-center text-xs font-semibold text-white">
                  {wishListLength}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart />
              {cartLength > 0 && (
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 px-1 text-center text-xs font-semibold text-white">
                  {cartLength}
                </span>
              )}
            </Link>

            <UserAuthButtons />
          </div>
        </div>
      </header>

      <ProductsNavigation links={productsNavLinks} />

      <main>
        {modal}

        {children}
      </main>

      <footer className="bg-white" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <SubscribeNewsletter />

        <div className="mx-auto px-6 pb-8 pt-4 sm:pt-8">
          <div className="gap-8 lg:flex">
            <div className="flex flex-1 flex-wrap justify-between gap-8 md:flex-nowrap">
              {footerNavLinks.map(({ title, subnav }) => (
                <div key={title} className="flex w-full justify-between">
                  {subnav.map((subNav) => (
                    <div key={subNav.title} className="inline-block lg:min-w-[10rem]">
                      <p className="mb-2 mt-5 font-bold">{subNav.title}</p>

                      {subNav.links.map((subLink) => (
                        <Link
                          className="relative table transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 after:ease-in-out hover:text-accent hover:after:w-full focus:bg-accent focus:text-accent-foreground"
                          key={subLink.link}
                          href={subLink.link}
                          title={subLink.title}
                        >
                          {subLink.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <MetalsWidget />
          </div>
          <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
            <div className="flex space-x-6 md:order-2">
              {socialLinks.map((item) => (
                <a
                  key={item.provider}
                  href={item.url}
                  className="h-4 w-4 text-gray-400 hover:text-gray-500"
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
      </footer>
    </div>
  );
}
