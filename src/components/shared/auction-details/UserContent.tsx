import type React from "react";
import ImageGallery, { GalleryMediaItem } from "./GalleryMedia";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Clock, Info, User } from "lucide-react";
import { BidHistory } from "./BidHistory";
import { type Auction, AuctionStatus } from "@/types/auctionTypes";
import type { DetailedBid } from "@/types/bidTypes";
import { Separator } from "@/components/ui/separator";
import PlaceBidForm from "./PlaceBidForm/PlaceBidForm";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { AuctionItemCard } from "./auction-item-card";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import useGetLoggedInUser from "@/server/user/getLoggedInUser/queries";
import Link from "next/link";

interface GalleryImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}

interface UserContentProps {
  token?: string;
  auction: Auction;
  auctionID: string;
  bids: DetailedBid[];
  title: string;
  images?: GalleryImage[];
  userID?: string;
}

const UserContent: React.FC<UserContentProps> = ({
  token,
  auction,
  auctionID,
  bids,
  title,
}) => {
  const currentBid = Number(auction.current_highest_bid);
  const reservePrice = Number(auction.buynow_price);
  const bidIncrement = Number(auction.bid_increment);
  const { data: koiData } = useGetKoiByID(auction.item);
  const koi = koiData;

  const startDate = format(
    new Date(auction.start_datetime),
    "dd/MM/yyyy HH:mm O",
  );
  const endDate = format(new Date(auction.end_datetime), "dd/MM/yyyy HH:mm O");

  const imageArray = koiData?.photo?.split("|") || [];
  const videoArray = koiData?.video?.split("|") || [];

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const videoBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/video/`;

  const koiMedia: GalleryMediaItem[] = [
    ...imageArray
      .filter((img) => img !== "")
      .map((img) => ({
        type: "image" as const,
        largeURL: `${imageBaseUrl}${img}`,
        width: 800,
        height: 400,
        alt: title,
        thumbnailURL: `${imageBaseUrl}${img}`, // Use image itself as thumbnail
      })),
    ...videoArray
      .filter((vid) => vid !== "")
      .map((vid) => ({
        type: "video" as const,
        largeURL: `${videoBaseUrl}${vid}`,
        width: 800,
        height: 400,
        alt: title,
        poster: undefined, // No need to define it
        thumbnailURL: undefined, // Let the video element handle the thumbnail
      })),
  ];
  const user = useGetLoggedInUser(token ?? "", { enabled: Boolean(token) });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <ImageGallery title={title} media={koiMedia} />
        <AuctionItemCard auction={auction} koi={koi} />
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          <StatusBadge status={auction.status} />
          <p>{auction.description}</p>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted">Start date : {startDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted">End date : {endDate}</p>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="grid gap-4 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-3xl font-bold">
                  {currentBid > 0
                    ? `Rp. ${currentBid.toLocaleString()}`
                    : "No bids yet"}
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reserve Price: Rp. {reservePrice.toLocaleString()}</p>
                    <p>
                      Minimum Increment: Rp. {bidIncrement.toLocaleString()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{auction.participants.length} users participated</span>
              </div>
            </div>

            <Separator />
            {token ? (
              <PlaceBidForm
                token={token}
                auctionID={auctionID}
                currentBid={currentBid}
                minIncrement={bidIncrement}
                isEnded={
                  auction.status === AuctionStatus.PENDING ||
                  auction.status === AuctionStatus.COMPLETED
                }
                status={auction.status}
                participationFee={Number(auction.participation_fee)}
                userBalance={Number(user.data?.data.wallet.balance)}
                hasJoined={auction.hasJoined}
              />
            ) : (
              <Button>
                <Link href="/login">Login to place a bid</Link>
              </Button>
            )}

            <Separator />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold">Bid History</h2>
            <BidHistory bids={bids} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserContent;
