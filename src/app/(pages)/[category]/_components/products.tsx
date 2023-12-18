"use client";

import { ArrowUpDownIcon } from "lucide-react";
import { parseAsJson, parseAsString, useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useTransition, type TransitionStartFunction } from "react";

import { ListItem } from "~/components/list-item";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import type { Item } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";
import type { TagsWithCounts } from "./types";

export const ItemsFilter = ({
  tags: namedTags,
  startTransition,
}: {
  tags: TagsWithCounts;
  startTransition: TransitionStartFunction;
}) => {
  const [filterState, setFilterState] = useQueryState(
    "filter",
    parseAsJson<Record<string, string[]>>().withOptions({ startTransition })
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Filter by:</h2>
      <Accordion
        className="w-full"
        collapsible
        type="single"
        defaultValue={Object.keys(namedTags)[0]}
      >
        {Object.entries(namedTags).map(([name, tags]) => (
          <AccordionItem key={`${name}-filter`} value={name}>
            <AccordionTrigger className="text-base">{name}</AccordionTrigger>
            {tags.map((tag) => (
              <AccordionContent key={tag.value}>
                <Label className="flex items-center gap-2 font-normal">
                  <Checkbox
                    id={tag.value}
                    checked={filterState?.[name]?.includes(tag.value) ?? false}
                    onCheckedChange={async (checked) => {
                      if (checked) {
                        return setFilterState((prev) => ({
                          ...prev,
                          [name]: prev?.[name]
                            ? [...prev[name]!, tag.value]
                            : [tag.value],
                        }));
                      }

                      if (!checked) {
                        const deletedIndex = filterState?.[name]?.indexOf(tag.value);

                        const newStateValue = filterState?.[name]
                          ? filterState[name]!.filter(
                              (_, index) => index !== deletedIndex
                            )
                          : [];

                        // 1 key left, new value of this key is empty -> delete whole state
                        if (
                          filterState &&
                          newStateValue.length === 0 &&
                          Object.keys(filterState).length === 1
                        ) {
                          return setFilterState(null);
                        }

                        // past 1st condition, but value still empty -> delete key
                        if (newStateValue.length === 0) {
                          delete filterState?.[name];
                          return setFilterState(filterState);
                        }

                        // simply replace the value
                        return setFilterState((prev) => ({
                          ...prev,
                          [name]: newStateValue,
                        }));
                      }
                    }}
                  />
                  {tag.badge && (
                    <Image src={tag.badge} alt={tag.value} width={16} height={16} />
                  )}
                  {tag.value}
                </Label>
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export const ProductsWithFilter = ({
  products,
  tags,
}: {
  products: Item[];
  tags: TagsWithCounts;
}) => {
  const [isLoading, startTransition] = useTransition();

  const [sortState, setSortState] = useQueryState(
    "sort",
    parseAsString.withOptions({ startTransition }).withDefault("popular")
  );

  return (
    <div className={cn("flex gap-4", isLoading && "pointer-events-none opacity-50")}>
      <div className="shrink-0 basis-1/4">
        <ItemsFilter tags={tags} startTransition={startTransition} />
      </div>

      <div className="flex-1">
        {products.length ? (
          <>
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  Jewellery Collection
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Discover our unique selection of jewellery including hand-finished
                  charms, bracelets, necklaces, rings and pendants to match your style
                  and personality.
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto shrink-0" variant="outline">
                    <ArrowUpDownIcon className="mr-2 h-4 w-4" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sortState}
                    onValueChange={(val) => setSortState(val)}
                  >
                    <DropdownMenuRadioItem value="popular">
                      Popular
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="date">Newest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="low">
                      Price: Low to High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high">
                      Price: High to Low
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid flex-1 grid-cols-3 gap-2">
              {products.map((product) => (
                <ListItem item={product} key={product._id} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please try another filter combination
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
