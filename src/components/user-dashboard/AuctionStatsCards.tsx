import React, { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Gavel, Package } from "lucide-react";

const AuctionStatsCard: FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          <Gavel className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-muted-foreground text-xs">+2 from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Package className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-muted-foreground text-xs">+3 new today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionStatsCard;
