"use client";

import type React from "react";

import type { Auction, AuctionStatus } from "@/types/auctionTypes";
import type { DetailedBid } from "@/types/bidTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Clock,
  ShieldIcon,
  Trophy,
  ExternalLink,
  BanknoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaGallery from "../GalleryMedia";
import { BidHistory } from "../BidHistory";
import { formatCurrency } from "@/lib/formatCurrency";
import { ParticipantHistory } from "../ParticipantHistory";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import { useAdminContentViewModel } from "./AdminContent.viewModel";
import Link from "next/link";
import KoiProductCard from "../koi-product-card";
import VerifiedButton from "./VerifiedButton";
import AuctionDialog from "@/components/admin/auctions-dialog/AuctionDialog";
import Countdown from "../../countdown/countdown";

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
  buynow_price: string;
  bidIncrement: string;
  participationFee: string;
  startingBidPrice: string;
  images?: GalleryImage[];
  token: string;
}

const AdminContent: React.FC<AdminContentProps> = (props) => {
  const {
    auction,
    bids,
    title,
    currentBid,
    buynow_price,
    bidIncrement,
    startingBidPrice,
    participationFee,
    token,
  } = props;
  const {
    koiData: koi,
    koiIsError,
    koiIsLoading,
    koiMedia,
    lastBidUpdate,
    showVerifyButton,
    showVerifiedButton,
    showPublishButton,
  } = useAdminContentViewModel(props);

  const winnerParticipant = auction.participants.filter(
    (participant) => participant.user.user_id === auction.winner_id,
  )[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <MediaGallery title={title} media={koiMedia} />
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
                  <p className="text-sm font-medium">Buy Now Price</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(buynow_price)}
                  </p>
                </div>
              </div>
              <Separator />
              <div
                dangerouslySetInnerHTML={{ __html: auction.rich_description }}
              />

              <KoiProductCard
                koi={koi}
                isAdmin={true}
                onKoiLoading={koiIsLoading}
                onKoiError={koiIsError}
              />
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
                <Countdown
                  startDate={auction.start_datetime}
                  endDate={auction.end_datetime}
                  status={auction.status as AuctionStatus}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Bid Increment</p>
                <p>{formatCurrency(bidIncrement)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Participation Fee</p>
                <p>{formatCurrency(participationFee)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Starting Bid Price</p>
                <p>{formatCurrency(startingBidPrice)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Winner</p>
                {winnerParticipant ? (
                  <Link
                    href={`/dashboard/users/${winnerParticipant.user.user_id}`}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      {winnerParticipant.user.username}
                    </div>
                  </Link>
                ) : (
                  <p>No winner yet</p>
                )}
              </div>
            </div>

            {showVerifyButton && (
              <div className="pt-2">
                <Button
                  className="w-full"
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  <Link
                    href={`/dashboard/auctions/verify/${auction.auction_id}`}
                    className="text-bold uppercase"
                  >
                    Verify Winner
                  </Link>
                </Button>
              </div>
            )}

            {showVerifiedButton && (
              <VerifiedButton auctionId={auction.auction_id} />
            )}
            {showPublishButton && (
              <div>
                <AuctionDialog
                  operation="publish"
                  bid_increment={auction.bid_increment}
                  buynow_price={auction.buynow_price}
                  auction_id={auction.auction_id}
                  token={token}
                  koiId={auction.item}
                  button
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminContent;
