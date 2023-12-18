import Image from "next/image";

import { FrontPageCarousel } from "~/components/carousel";
import { CategoryItem, ListItem } from "~/components/list-item";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
    <main className="flex min-h-screen flex-col items-center justify-center">
      {banner && (
        <div className="relative mb-4 h-[250px] w-full border-4 border-accent">
          <Image fill src={banner.image} alt={banner.alt ?? "Banner"} />
        </div>
      )}

      {carouselItems.length > 0 && (
        <FrontPageCarousel slides={carouselItems.map((item) => item.image)} />
      )}

      <Card className="my-4 w-full rounded-xl bg-white px-8 py-4">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">
              Categories
            </CardTitle>
          </CardHeader>
          <div className="mt-4 flex items-center justify-center gap-4">
            {categories.map((item) => (
              <CategoryItem key={item.name} category={item} />
            ))}
          </div>
        </CardContent>
      </Card>

      {featuredItems.length > 0 && (
        <Card className="my-4 w-full rounded-xl bg-white px-8 py-4">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary">
                Featured items
              </CardTitle>
            </CardHeader>

            <div className="mt-4 flex items-center justify-center gap-4">
              {featuredItems.map((item) => (
                <ListItem key={item.name} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {trendingItems.length > 0 && (
        <Card className="my-4 w-full rounded-xl bg-white px-8 py-4">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary">
                Trending items
              </CardTitle>
            </CardHeader>

            <div className="mt-4 flex items-center justify-center gap-4">
              {trendingItems.map((item) => (
                <ListItem key={item._id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {viewedItems.length > 0 && (
        <Card className="my-4 w-full rounded-xl bg-white px-8 py-4">
          <CardContent>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary">
                Recently viewed
              </CardTitle>
            </CardHeader>

            <div className="mt-4 flex items-center justify-center gap-4">
              {viewedItems.map((item) => (
                <ListItem key={item.name} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
