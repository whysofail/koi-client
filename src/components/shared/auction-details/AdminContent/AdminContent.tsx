"use client";

import { Auction, AuctionStatus } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, DollarSign, ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "../ImageGallery";
import { BidHistory } from "../BidHistory";
import { formatCurrency } from "@/lib/formatCurrency";
import { ParticipantHistory } from "../ParticipantHistory";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import { useAdminContentViewModel } from "./AdminContent.viewModel";
import Link from "next/link";

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

const AdminContent: React.FC<AdminContentProps> = (props) => {
  const { auction, bids, title, currentBid, reservePrice, bidIncrement } =
    props;
  const {
    koiImages,
    lastBidUpdate,
    countdown,
    showVerifyButton,
    showVerifiedButton,
  } = useAdminContentViewModel(props);

  const auctionData = {
    title,
    description: auction.description,
    item: auction.item,
    start_datetime: auction.start_datetime,
    end_datetime: auction.end_datetime,
    buynow_price: auction.buynow_price,
    bid_increment: auction.bid_increment,
    status: auction.status,
  };

  const auctionParams = new URLSearchParams(auctionData).toString();
  const verifyAuctionHref = `/dashboard/auctions/verify/${auction.auction_id}?${auctionParams}`;

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
              <ShieldIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p>
                  <StatusBadge status={auction.status as AuctionStatus} />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Participants</p>
                <p>{auction.participants.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time Remaining</p>
                <p>{countdown}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Bid Increment</p>
                <p>{formatCurrency(bidIncrement)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Winner</p>
                <p>{auction.winner_id || "No winner yet"}</p>
              </div>
            </div>

            {showVerifyButton && (
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full"
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  <Link
                    href={verifyAuctionHref}
                    className="text-bold uppercase"
                  >
                    Verify Winner
                  </Link>
                </Button>
              </div>
            )}

            {showVerifiedButton && (
              <div className="pt-2">
                <Button
                  className="w-full"
                  disabled
                  style={{
                    color: "green",
                    border: "1px solid green",
                    backgroundColor: "transparent",
                  }}
                >
                  <p className="text-bold uppercase">Auction Winner Verified</p>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
