import { Card, CardContent } from "@/components/ui/card";
import KoiProductCard from "./koi-product-card";

interface AuctionItemCardProps {
  auction: any;
  koi?: any;
  onKoiLoading: boolean;
  onKoiError: boolean;
}

export function AuctionItemCard({
  koi,
  onKoiError,
  onKoiLoading,
}: AuctionItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* <h2 className="mb-4 font-semibold">Item Details</h2> */}

        <div className="space-y-4">
          <KoiProductCard
            koi={koi}
            isAdmin={false}
            onKoiLoading={onKoiLoading}
            onKoiError={onKoiError}
          />
        </div>
      </CardContent>
    </Card>
  );
}
