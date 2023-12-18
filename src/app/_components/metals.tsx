import { unstable_cache } from "next/cache";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

type MetalsResponse =
  | {
      status: "success";
      currency: "USD";
      unit: "toz";
      metals: Record<string, number>;
      currencies: Record<string, number>;
      timestamps: {
        metals: string;
        currencies: string;
      };
    }
  | {
      status: "error";
      message: string;
    };

const metalNames: Record<string, string> = {
  gold: "Spot Gold",
  silver: "Spot Silver",
  platinum: "Spot Platinum",
  palladium: "Spot Palladium",
  lbma_gold_am: "LBMA Gold AM",
  lbma_gold_pm: "LBMA Gold PM",
  lbma_silver: "LBMA Silver",
  lbma_platinum_am: "LBMA Platinum AM",
  lbma_platinum_pm: "LBMA Platinum PM",
  lbma_palladium_am: "LBMA Palladium AM",
  lbma_palladium_pm: "LBMA Palladium PM",
  mcx_gold: "MCX Gold Futures",
  mcx_gold_am: "MCX Spot Gold AM",
  mcx_gold_pm: "MCX Spot Gold PM",
  mcx_silver: "MCX Silver Futures",
  mcx_silver_am: "MCX Spot Silver AM",
  mcx_silver_pm: "MCX Spot Silver PM",
  ibja_gold: "IBJA Gold",
  aluminum: "Spot Aluminum",
  copper: "Spot Copper",
  lead: "Spot Lead",
  nickel: "Spot Nickel",
  zinc: "Spot Zinc",
  lme_aluminum: "LME Aluminum 3M",
  lme_copper: "LME Copper 3M",
  lme_lead: "LME Lead 3M",
  lme_nickel: "LME Nickel 3M",
  lme_zinc: "LME Zinc 3M",
};

const getMetalsData = unstable_cache(
  async () => {
    const metals = await fetch(
      "https://api.metals.dev/v1/latest?api_key=SXQGJMVJ7TGPDKIK0KCP331IK0KCP&currency=USD&unit=toz"
    );

    return metals.json() as Promise<MetalsResponse>;
  },
  ["metals-data"],
  { revalidate: 60 * 60 * 24 }
);

export async function MetalsWidget() {
  const metals = await getMetalsData();

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Metals</CardTitle>
        </CardHeader>

        <ScrollArea className="h-32">
          <div className="flex flex-col space-y-2 px-4">
            {metals.status === "success" ? (
              Object.entries(metals.metals).map(([metal, price]) => (
                <div key={metal} className="flex justify-between gap-4">
                  <span className="font-semibold">{metalNames[metal]}</span>
                  <span className="font-medium text-accent">${price}</span>
                </div>
              ))
            ) : (
              <div>{metals.message}</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
