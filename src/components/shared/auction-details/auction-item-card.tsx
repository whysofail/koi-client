import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, RulerIcon, InfoIcon, UserIcon } from "lucide-react";

// Helper function to calculate age display from birthdate
const calculateAge = (birthdate?: string): string => {
  if (!birthdate) return "Unknown";

  const birthDate = new Date(birthdate);
  const now = new Date();

  const yearDiff = now.getFullYear() - birthDate.getFullYear();

  if (yearDiff < 1) {
    const monthDiff = now.getMonth() - birthDate.getMonth();
    return `${monthDiff} months`;
  }

  return `${yearDiff} years`;
};

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

          {koi && (
            <div>
              <h3 className="mb-3 text-lg font-bold text-muted-foreground">
                Koi Details
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <RulerIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Size:</span>
                  <span>{koi?.size ? `${koi.size} cm` : "Unknown"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Age:</span>
                  <span>
                    {koi?.birthdate ? calculateAge(koi.birthdate) : "Unknown"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Variety:</span>
                  <span>{koi?.variety?.name || "Unknown"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Breeder:</span>
                  <span>{koi?.breeder?.name || "Unknown"}</span>
                </div>

                {koi?.gender && (
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Gender:</span>
                    <span>{koi.gender}</span>
                  </div>
                )}

                {koi?.bloodline && (
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Bloodline:</span>
                    <span>
                      {typeof koi.bloodline === "object"
                        ? koi.bloodline.name
                        : koi.bloodline}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
