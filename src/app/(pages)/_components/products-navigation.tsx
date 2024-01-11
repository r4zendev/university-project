"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import type { Navigation } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";

export const ProductsNavigation = ({ links }: { links: Navigation[] }) => {
  return (
    <div className="border-b border-secondary">
      <div className="container">
        <NavigationMenu className="py-4">
          <NavigationMenuList>
            {links.map(({ link, title, subnav }) => (
              <NavigationMenuItem key={title}>
                <NavigationMenuTrigger className="hover:underline">
                  <Link href={link} className="pr-2">
                    {title}
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex gap-2 p-4">
                  {subnav.map((subNav) => (
                    <div key={subNav.title} className="min-w-[10rem]">
                      <p className="mb-3 font-bold">{subNav.title}</p>
                      {subNav.links.map((subLink) => (
                        <ul key={subLink.link}>
                          <ListItem href={subLink.link} title={subLink.title} />
                        </ul>
                      ))}
                    </div>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "relative inline-block select-none space-y-1 leading-none outline-none transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 after:ease-in-out hover:text-accent hover:after:w-full focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
