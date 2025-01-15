import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Flag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FeaturedAuctionsProps = {
  isAdmin: boolean;
};

const FeaturedAuctions: FC<FeaturedAuctionsProps> = ({
  isAdmin,
}: FeaturedAuctionsProps) => {
  if (isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Premium Listing #{i + 1}
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Flag className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-md">
                {/* <img
                  src={`/placeholder.svg?height=300&width=300`}
                  alt={`Featured Item ${i + 1}`}
                  className="object-cover"
                /> */}
                <Badge className="absolute right-2 top-2">Featured</Badge>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">$1,250</div>
                  <div className="text-muted-foreground text-sm">15 bids</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">Ends in 2d 5h</p>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vintage Camera #{i + 1}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square overflow-hidden rounded-md">
              <img
                src={`/placeholder.svg?height=300&width=300`}
                alt={`Vintage Camera ${i + 1}`}
                className="object-cover"
              />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold">$750</div>
              <p className="text-muted-foreground text-sm">Ends in 2d 5h</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedAuctions;
