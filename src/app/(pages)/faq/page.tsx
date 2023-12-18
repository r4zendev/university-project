import { marked } from "marked";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getFAQGroups } from "~/lib/sanity/queries";

export default async function FAQ() {
  const groups = await getFAQGroups();

  return (
    <div>
      <h1 className="my-4 text-center text-3xl">Frequently Asked Questions</h1>

      <Tabs defaultValue={groups[0]?.name} className="w-full">
        <TabsList className="mx-auto flex h-auto w-full gap-4 bg-inherit">
          {groups.map((group) => (
            <TabsTrigger
              className="cursor-pointer data-[state=active]:underline"
              key={group.name}
              value={group.name}
              asChild
            >
              <div className="text-center">
                <Image
                  src={group.image}
                  alt="FAQ Group Image"
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <p className="font-light">{group.name}</p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group.name} value={group.name} asChild className="w-full">
            <Accordion type="single" collapsible>
              {group.children.map((child) => (
                <AccordionItem key={child.title} value={child.title}>
                  <AccordionTrigger>
                    <h3 className="text-lg font-semibold">{child.title}</h3>
                  </AccordionTrigger>

                  <AccordionContent>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(child.content),
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4"></div>
    </div>
  );
}
