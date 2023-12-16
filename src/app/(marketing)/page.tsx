import Image from "next/image";

import { FrontPageCarousel } from "~/components/carousel";
import {
  getBannerImage,
  getCategories,
  getItems,
  getSliderImages,
  getTrendingItems,
} from "~/lib/sanity/queries";
import { getViewsCookie } from "~/lib/utils/cookies";
import { CategoryItem, ListItem } from "./_components/list-item";

export default async function Home() {
  const carouselItems = await getSliderImages();
  const banner = await getBannerImage();

  const categories = await getCategories();
  const featuredItems = await getItems({ featured: true });
  const trendingItems = await getTrendingItems();

  const { value: viewed } = getViewsCookie();
  const viewedItems = viewed ? await getItems({ ids: viewed }) : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {banner && (
        <div className="w-full h-[250px] relative mb-4 border-accent border-4">
          <Image fill src={banner.image} alt={banner.alt ?? "Banner"} />
        </div>
      )}

      <FrontPageCarousel
        slides={carouselItems.map((item) => item.image)}
        // options={{ delay: 2500 }}
      />

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <div className="flex items-center gap-4 justify-center mt-4">
          {categories.map((item) => (
            <CategoryItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {featuredItems.length > 0 && (
        <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
          <h2 className="text-2xl font-semibold text-primary-foreground">
            Featured items
          </h2>

          <div className="flex items-center gap-4 justify-center mt-4">
            {featuredItems.map((item) => (
              <ListItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-primary-foreground">
          Trending items
        </h2>

        <div className="flex items-center gap-4 justify-center mt-4">
          {trendingItems.map((item) => (
            <ListItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      {viewedItems.length > 0 && (
        <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
          <h2 className="text-2xl font-semibold text-primary-foreground">
            Recently viewed
          </h2>

          <div className="flex items-center gap-4 justify-center mt-4">
            {viewedItems.map((item) => (
              <ListItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* <NewestCollections /> */}

      {/* <PromotionalOffers /> */}
    </main>
  );
}
