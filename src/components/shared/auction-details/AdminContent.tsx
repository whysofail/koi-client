import React, { useEffect, useState } from "react";
import { Auction } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";
import { BidHistory } from "./BidHistory";
import { AuctionParticipant } from "@/types/auctionParticipantTypes";
import {
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  isPast,
} from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
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

      if (auction.status !== "STARTED") {
        setCountdown("Auction has not started yet");
        return;
      } else if (isPast(endTime)) {
        setCountdown("Auction ended");
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
      console.log("New bids received:", bids.length);
    }
  }, [bids]);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
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
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="bids">
            <Card className="hover:bg-inherit">
              <CardContent className="py-2">
                <BidHistory bids={bids} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="participants">
            <Card>
              <CardContent className="p-6">
                {auction.participants.length > 0 ? (
                  <div className="grid gap-4">
                    {auction.participants.map(
                      (participant: AuctionParticipant) => (
                        <div
                          key={participant.auction_participant_id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium">
                                {participant.user.username}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {participant.user.user_id}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Date Joined</p>
                            <p className="text-muted-foreground text-xs">
                              {formatDistanceToNow(participant.joined_at, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No participants yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="logs">
            <Card>
              <CardContent className="p-6">
                <div className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No activity logs yet
                  </p>
                </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <Shield className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Reports</p>
                <p className="text-muted-foreground">No reports filed</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                View Audit Log
              </Button>
              <Button variant="outline" className="w-full">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
