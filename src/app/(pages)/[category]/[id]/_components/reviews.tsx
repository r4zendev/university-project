"use client";

import { formatDistance } from "date-fns";
import { Star } from "lucide-react";
import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import type { Review } from "~/lib/sanity/types";
import { cn } from "~/lib/utils";

export const PaginatedReviews = ({ reviews }: { reviews: Review[] }) => {
  const [activePage, setActivePage] = useState(1);
  const totalPages = Math.ceil(reviews.length / 5);

  return (
    <>
      {reviews.slice((activePage - 1) * 5, (activePage - 1) * 5 + 5).map((review) => (
        <div key={review._id} className="flex flex-col gap-2 pt-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex">
              {Array.from({ length: review.rating })
                .concat(Array.from({ length: 5 - review.rating }).fill("unfilled"))
                .map((check, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      check !== "unfilled" && "fill-yellow-500 text-yellow-500"
                    )}
                  />
                ))}
            </div>
            <p className="font-medium">{review.username ?? review.email}</p>
            <p>
              {formatDistance(new Date(review._createdAt), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          <p className="text-md font-semibold">{review.title}</p>
          <p className="text-lg">{review.content}</p>
        </div>
      ))}

      <Pagination>
        <PaginationContent className="mt-2 [&>*]:cursor-pointer">
          <PaginationPrevious
            className={cn(activePage === 1 && "cursor-not-allowed")}
            onClick={() => activePage !== 1 && setActivePage((p) => p - 1)}
          />

          {Array.from({
            length: Math.min(3, totalPages - Math.max(0, activePage - 2)),
          }).map((_, i) => {
            const pageNumber = Math.max(1, activePage - 1) + i;

            return (
              <PaginationLink
                key={i}
                onClick={() => setActivePage(pageNumber)}
                isActive={activePage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            );
          })}

          {totalPages > 3 && totalPages - activePage > 2 && <PaginationEllipsis />}

          <PaginationNext
            className={cn(activePage === totalPages && "cursor-not-allowed")}
            onClick={() => activePage !== totalPages && setActivePage((p) => p + 1)}
          />
        </PaginationContent>
      </Pagination>
    </>
  );
};
