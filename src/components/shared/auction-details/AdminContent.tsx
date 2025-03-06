"use client";

import React, { useEffect, useState } from "react";
import { Auction, AuctionStatus } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, DollarSign, ShieldIcon } from "lucide-react";
import ImageGallery from "./ImageGallery";
import { BidHistory } from "./BidHistory";
import { formatDuration, intervalToDuration, isPast } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { ParticipantHistory } from "./ParticipantHistory";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
interface GalleryImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}
interface AdminContentProps {
  auction: Auction;
  bids: DetailedBid[];
  title: string;
  currentBid: string;
  reservePrice: string;
  bidIncrement: string;
  images?: GalleryImage[];
}

const AdminContent: React.FC<AdminContentProps> = ({
  auction,
  bids,
  title,
  currentBid,
  reservePrice,
  bidIncrement,
}) => {
  const [lastBidUpdate, setLastBidUpdate] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<string>("");

  const { data } = useGetKoiByID(auction.item);
  const imageArray = data?.photo?.split("|") || [];
  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  // Filter empty string ""
  const koiImages = imageArray
    .filter((img) => img !== "")
    .map((img) => ({
      thumbnailURL: imageBaseUrl + img,
      largeURL: imageBaseUrl + img,
      height: 800,
      width: 400,
      alt: title,
    }));

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date(auction.end_datetime);

      if (auction.status === AuctionStatus.PENDING) {
        setCountdown("Auction ended. Pending for payment verification");
        return;
      }
      if (auction.status !== AuctionStatus.STARTED) {
        setCountdown("Auction has not started yet");
        return;
      }

      if (isPast(endTime)) {
        setCountdown("Auction has ended");
        return;
      }

      const duration = intervalToDuration({
        start: now,
        end: endTime,
      });

      setCountdown(formatDuration(duration, { delimiter: ", " }));
    };

    updateCountdown(); // Initial update
    const intervalId = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [auction.end_datetime, auction.status]);

  useEffect(() => {
    if (bids?.length) {
      setLastBidUpdate(new Date());
    }
  }, [bids]);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <ImageGallery title={title} images={koiImages} />
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Current Bid</p>
                  <p className="text-2xl font-bold">
                    {Number.parseFloat(currentBid) > 0
                      ? formatCurrency(currentBid)
                      : "No bids yet"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reserve Price</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(reservePrice)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div
            className={`h-2 w-2 rounded-full ${bids?.length ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span>Last bid update: {lastBidUpdate.toLocaleTimeString()}</span>
        </div>
        <Tabs defaultValue="bids">
          <TabsList>
            <TabsTrigger value="bids">Bid History</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
          </TabsList>
          <TabsContent value="bids">
            <Card className="hover:bg-inherit">
              <CardContent className="px-0 py-2">
                <BidHistory bids={bids} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="participants">
            <Card className="hover:bg-inherit">
              <CardContent className="px-0 py-2">
                <ParticipantHistory participants={auction.participants} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <ShieldIcon className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p>
                  <StatusBadge status={auction.status as AuctionStatus} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Total Participants</p>
                <p>{auction.participants.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Time Remaining</p>
                <p>{countdown}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Bid Increment</p>
                <p>{formatCurrency(bidIncrement)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Winner</p>
                <p>{auction.winner_id || "No winner yet"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
