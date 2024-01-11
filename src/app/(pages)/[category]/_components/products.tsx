"use client";

import { ArrowUpDownIcon } from "lucide-react";
import { parseAsJson, parseAsString, useQueryState } from "next-usequerystate";
import Image from "next/image";
import { useState, useTransition, type TransitionStartFunction } from "react";

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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
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
        type="multiple"
        defaultValue={Object.keys(namedTags)}
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
                  {tag.value} ({tag.count})
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
  category: string;
}) => {
  const [isLoading, startTransition] = useTransition();

  const [sortState, setSortState] = useQueryState(
    "sort",
    parseAsString.withOptions({ startTransition }).withDefault("popular")
  );
  const [activePage, setActivePage] = useState(1);
  const totalPages = Math.ceil(products.length / 5);

  return (
    <div
      className={cn(
        "container mb-8 mt-4 flex gap-4",
        isLoading && "pointer-events-none opacity-50"
      )}
    >
      <div className="shrink-0 basis-1/4">
        <ItemsFilter tags={tags} startTransition={startTransition} />
      </div>

      <div className="flex-1">
        {products.length ? (
          <div className="flex h-full flex-col justify-between gap-2">
            <div className="space-y-2">
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
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

              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {products
                  .slice((activePage - 1) * 5, (activePage - 1) * 5 + 5)
                  .map((product) => (
                    <ListItem item={product} key={product._id} />
                  ))}
              </div>
            </div>

            <Pagination className="justify-end">
              <PaginationContent className="[&>*]:cursor-pointer">
                <PaginationPrevious
                  className={cn(activePage === 1 && "cursor-not-allowed")}
                  onClick={() => activePage !== 1 && setActivePage((p) => p - 1)}
                />
                {Array.from({
                  length: Math.min(3, totalPages - Math.max(0, activePage - 1)),
                }).map((_, i) => (
                  <PaginationLink
                    key={i}
                    onClick={() =>
                      setActivePage(activePage - 1 + i + Math.max(0, 2 - activePage))
                    }
                  >
                    {activePage - 1 + i + Math.max(0, 2 - activePage)}
                  </PaginationLink>
                ))}

                {totalPages > 3 && <PaginationEllipsis />}
                <PaginationNext
                  className={cn(activePage === totalPages && "cursor-not-allowed")}
                  onClick={() =>
                    activePage !== totalPages && setActivePage((p) => p + 1)
                  }
                />
              </PaginationContent>
            </Pagination>
          </div>
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
