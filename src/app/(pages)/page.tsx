import Image from "next/image";
import Link from "next/link";

import { DragFreeCarousel } from "~/components/carousels/basic";
import { TopPageCarousel } from "~/components/carousels/top-page";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import {
  getBannerImage,
  getCategories,
  getItems,
  getSettings,
  getSliderImages,
  getTrendingItems,
} from "~/lib/sanity/queries";
import type { Item, SliderBanner, TopBanner } from "~/lib/sanity/types";
import { getViewsCookie } from "~/lib/utils/cookies";

export default async function Home() {
  const settings = await getSettings();
  const categories = await getCategories();

  let featuredItems: Item[] = [];
  let trendingItems: Item[] = [];
  let viewedItems: Item[] = [];
  let banner: TopBanner | null = null;
  let carouselItems: SliderBanner[] = [];

  if (settings) {
    if (settings.enableFeaturedItems) {
      featuredItems = await getItems({ featured: true });
    }
    if (settings.enableTrendingItems) {
      trendingItems = await getTrendingItems();
    }
    if (settings.enableFrontPageBanner) {
      banner = await getBannerImage();
    }
    if (settings.enableFrontPageSlider) {
      carouselItems = await getSliderImages();
    }
    if (settings.enableRecentlyViewed) {
      const { value: viewed } = getViewsCookie();
      viewedItems = viewed ? await getItems({ ids: viewed }) : [];
    }
  } else {
    featuredItems = await getItems({ featured: true });
    trendingItems = await getTrendingItems();
    banner = await getBannerImage();
    carouselItems = await getSliderImages();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {banner && (
        <AspectRatio ratio={16 / 8}>
          {banner.url ? (
            <Link href={banner.url}>
              <Image fill src={banner.image} alt={banner.alt ?? "Banner"} />
            </Link>
          ) : (
            <Image fill src={banner.image} alt={banner.alt ?? "Banner"} />
          )}
        </AspectRatio>
      )}

      <div className="w-full max-w-7xl lg:container">
        {carouselItems.length > 0 && <TopPageCarousel items={carouselItems} />}

        <div className="px-[1rem]">
          <DragFreeCarousel
            items={categories.map((c) => ({
              ...c,
              category: { slug: c.slug },
              url: `/${c.slug}`,
            }))}
          />

          {featuredItems.length > 0 && (
            <div>
              <p className="mb-2 mt-4 text-lg font-semibold text-primary lg:text-2xl">
                Featured items
              </p>
              <DragFreeCarousel items={featuredItems} />
            </div>
          )}

          {trendingItems.length > 0 && (
            <div>
              <p className="mb-2 mt-4 text-lg font-semibold text-primary lg:text-2xl">
                Trending items
              </p>
              <DragFreeCarousel items={trendingItems} />
            </div>
          )}

          {viewedItems.length > 0 && (
            <div>
              <p className="mb-2 mt-4 text-lg font-semibold text-primary lg:text-2xl">
                Viewed items
              </p>
              <DragFreeCarousel items={viewedItems} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
