"use client";

import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Info } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";
import useLatestAuctionsViewModel from "./LatestAuctions.viewModel";
import { Badge } from "@/components/ui/badge";

//TODO: Currently the data only filtered by PUBLISHED status, we need to filter by STARTED and ENDED status as well

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const variants: Record<
    string,
    {
      variant: "default" | "secondary" | "outline" | "destructive";
      label: string;
    }
  > = {
    PUBLISHED: { variant: "default", label: "Upcoming" },
    STARTED: { variant: "secondary", label: "Live" },
    ENDED: { variant: "outline", label: "Ended" },
  };

  const { variant, label } = variants[status] || {
    variant: "outline",
    label: status,
  };
  return <Badge variant={variant}>{label}</Badge>;
};

const LatestAuctions: FC = () => {
  const { auctions, isLoading, isEmpty } = useLatestAuctionsViewModel();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="aspect-square w-full" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2 pt-6">
          <Info className="h-5 w-5 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No featured auctions available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <Card key={auction.auction_id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                {auction.title}
              </CardTitle>
              <StatusBadge status={auction.status} />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <Image
                src="/placeholder.webp"
                alt={auction.title}
                className="h-full w-full object-cover"
                width={400}
                height={400}
                priority={true}
              />
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold">
                {formatCurrency(auction.reserve_price)}
              </div>
              <p className="text-sm text-muted-foreground">
                Ends {format(new Date(auction.end_datetime), "MMM d, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LatestAuctions;
