import { marked } from "marked";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { FAQGroup } from "~/lib/sanity/types";

export const FAQTabs = ({ groups }: { groups: FAQGroup[] }) => {
  if (!groups.length) {
    return null;
  }

  return (
    <Tabs>
      <TabsList>
        {groups.map((group) => (
          <TabsTrigger key={group.name} className="text-center" value={group.name}>
            <Image
              src={group.image}
              alt="FAQ Group Image"
              width={150}
              height={150}
              className="rounded-full"
            />

            <p className="font-light">{group.name}</p>
          </TabsTrigger>
        ))}
      </TabsList>

      {groups.map((group) => (
        <TabsContent key={group.name} value={group.name} asChild>
          <Accordion type="single">
            {group.children.map((child) => (
              <AccordionItem key={child.title} value={child.title}>
                <AccordionTrigger asChild>
                  <h3 className="text-lg font-semibold">{child.title}</h3>
                </AccordionTrigger>

                <AccordionContent>
                  <p>{marked.parse(child.content)}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      ))}
    </Tabs>
  );
};
