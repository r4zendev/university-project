import { notFound } from "next/navigation";

import { Section } from "~/components/section";
import { getPage } from "~/lib/sanity/queries";

// ISR?
export const revalidate = 60;

export default async function CustomPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const page = await getPage(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="w-full">
      {page.sections?.map((section) => <Section key={section._id} section={section} />)}
    </div>
  );
}
