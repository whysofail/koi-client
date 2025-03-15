import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import KoiProductCard from "./koi-product-card";

interface AuctionItemCardProps {
  auction: any;
  koi?: any;
}

export function AuctionItemCard({ auction, koi }: AuctionItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h2 className="mb-4 font-semibold">Item Details</h2>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-bold text-muted-foreground">
              Description
            </h3>
            <p className="whitespace-pre-wrap text-sm">{auction.description}</p>
            <div
              className="mt-2 text-sm"
              dangerouslySetInnerHTML={{
                __html: auction.rich_description ?? "",
              }}
            />
          </div>

          <Separator className="my-4" />

          <KoiProductCard koi={koi} isAdmin={false} />
        </div>
      </CardContent>
    </Card>
  );
}
