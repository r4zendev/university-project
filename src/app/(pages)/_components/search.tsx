"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { performSearch } from "~/actions/perform-search";
import { Input } from "~/components/ui/input";
import type { getSearchQuery } from "~/lib/sanity/queries";
import { capitalize } from "~/lib/utils";

export function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getSearchQuery>> | null>(
    null
  );
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchValue) {
      return;
    }

    const getData = async () => {
      const data = await performSearch(searchValue);

      setData(data);
      setLoading(false);
    };

    void getData();
  }, [searchValue]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!search) {
        return;
      }
      setLoading(true);
      setSearchValue(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 h-full w-full rounded-md bg-gray-500 opacity-50">
          <Loader2 className="mx-auto mt-2 animate-spin text-primary" />
        </div>
      )}
      <Input
        type="search"
        placeholder="Search..."
        className="focus-visible:ring-0 md:w-[100px] lg:w-[300px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {(!!data?.items.length || !!data?.pages.length) && (
        <div className="absolute top-3/4 w-full overflow-hidden rounded-b-md border bg-secondary">
          {data?.items.map((item) => (
            <Link href={item.url} key={item.slug} className="flex h-16 justify-between">
              {item.images[0] && (
                <Image src={item.images[0]} alt={item.name} width={65} height={65} />
              )}

              <div className="mr-2 flex flex-col justify-center text-yellow-800">
                <span>{item.name}</span>
              </div>
            </Link>
          ))}

          {data?.pages.length > 0 && (
            <div className="p-2">
              <p className="text-md mb-1 mt-2 text-white">
                Pages that might interest you
              </p>
              {data?.pages.map((item) => (
                <Link
                  href={`pages/${item.slug}`}
                  key={item.slug}
                  className="hover:underline"
                >
                  <span className="text-md">{capitalize(item.slug)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
