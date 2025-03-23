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
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import Link from "next/link";

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

// Separate component for auction card to use hooks properly
const AuctionCard: FC<{ auction: any; token: string }> = ({ auction }) => {
  const { data: koiData } = useGetKoiByID(auction.item);
  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl = imageArray[0]
    ? `${imageBaseUrl}${imageArray[0]}`
    : "/placeholder.webp";

  return (
    <Card
      key={auction.auction_id}
      className="flex h-full flex-col transition-all hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="min-w-0 flex-1 space-y-1 pr-2">
          <CardTitle className="line-clamp-1 text-sm font-medium">
            {auction.title}
          </CardTitle>
          <StatusBadge status={auction.status} />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <Heart className="h-4 w-4" />
        </Button>
      </CardHeader>
      <Link href={`/auctions/${auction.auction_id}`}>
        <CardContent className="flex-grow">
          <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
            <Image
              src={imageUrl}
              alt={auction.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              width={400}
              height={400}
              priority={true}
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-lg font-bold">
                {formatCurrency(auction.buynow_price)}
              </div>
              <p className="text-xs text-muted-foreground">
                Ends {format(new Date(auction.end_datetime), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

const LatestAuctions: FC<{ token: string }> = ({ token }) => {
  const { auctions, isLoading, isEmpty } = useLatestAuctionsViewModel(token);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex h-full flex-col">
            <CardContent className="flex-grow pt-6">
              <Skeleton className="aspect-square w-full rounded-md" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
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
      <Card className="w-full">
        <CardContent className="flex items-center justify-center gap-2 p-8">
          <Info className="h-5 w-5 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No featured auctions available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard key={auction.auction_id} auction={auction} token={token} />
      ))}
    </div>
  );
};

export default LatestAuctions;
