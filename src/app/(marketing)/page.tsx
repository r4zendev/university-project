import Image from "next/image";

import { FrontPageCarousel } from "~/components/carousel";
import {
  getBannerImage,
  getCategories,
  getSliderImages,
  getTrendingItems,
} from "~/lib/sanity/queries";
import { CategoryItem, TrendingItem } from "./_components/list-item";

export default async function Home() {
  const categories = await getCategories();
  const trendingItems = await getTrendingItems();
  const carouselItems = await getSliderImages();
  const banner = await getBannerImage();

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

      {/* <CategoriesSelection /> */}

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <div className="flex items-center gap-4 justify-center mt-4">
          {categories.map((item) => (
            <CategoryItem key={item.name} item={item} />
          ))}
        </div>
      </div>

      {/* <RecentlyViewed /> */}

      <div className="w-full my-4 px-8 py-4 rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-primary-foreground">
          Trending items
        </h2>

        <div className="flex items-center gap-4 justify-center mt-4">
          {trendingItems.map((item) => (
            <TrendingItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* <NewestCollections /> */}

      {/* <PromotionalOffers /> */}
    </main>
  );
}
