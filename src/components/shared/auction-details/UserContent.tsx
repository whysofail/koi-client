import type React from "react";
import ImageGallery, { type GalleryMediaItem } from "./GalleryMedia";
import { Card, CardContent } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Timer, User, Calendar } from "lucide-react";
import { BidHistory } from "./BidHistory";
import { type Auction, AuctionStatus } from "@/types/auctionTypes";
import type { DetailedBid } from "@/types/bidTypes";
import { Separator } from "@/components/ui/separator";
import PlaceBidForm from "./PlaceBidForm/PlaceBidForm";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { AuctionItemCard } from "./auction-item-card";
import { format, isAfter } from "date-fns";
import useGetLoggedInUser from "@/server/user/getLoggedInUser/queries";
import Link from "next/link";
// import AuctionNotStarted from "./AuctionNotStarted";
import { formatCurrency } from "@/lib/formatCurrency";
import Countdown from "../countdown/countdown";
import { Badge } from "@/components/ui/badge";

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
  isBanned?: boolean;
}

const UserContent: React.FC<UserContentProps> = ({
  token,
  auction,
  auctionID,
  bids,
  title,
  isBanned,
}) => {
  const currentBid = Number(auction.current_highest_bid);
  const reservePrice = Number(auction.buynow_price);
  const bidIncrement = Number(auction.bid_increment);
  const startingBidPrice = Number(auction.bid_starting_price);
  const {
    data: koiData,
    isLoading: koiIsLoading,
    isError: koiIsError,
  } = useGetKoiByID(auction.item);
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

  // Check if auction has not started yet
  const isNotStarted = auction.status === AuctionStatus.PUBLISHED;

  const getStatusBadge = () => {
    switch (auction.status) {
      case "PUBLISHED":
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-blue-300 bg-blue-100 py-2 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200"
          >
            <Calendar className="mr-1 h-4 w-4" />
            Upcoming
          </Badge>
        );
      case "STARTED":
        return (
          <Badge
            variant="outline"
            className="items-center justify-center rounded-xl border-green-300 bg-green-100 py-2 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
          >
            <Timer className="mr-1 h-4 w-4" />
            Ongoing
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-gray-300 bg-gray-100 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <CheckCircle2 className="mr-1 h-4 w-4" />
            ENDED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-yellow-300 bg-yellow-100 py-2 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            {auction.status}
          </Badge>
        );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="lg:hidden">
        <div className="mb-4 flex items-center space-x-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          {getStatusBadge()}
        </div>
        <div className="flex flex-col justify-between">
          Auction Period
          <div className="flex items-center gap-2">
            {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
            <p className="text-md text-muted">Start : {startDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
            <p className="text-md text-muted">End : {endDate}</p>
          </div>
          <Countdown
            className="rounded-xl"
            startDate={auction.start_datetime}
            endDate={auction.end_datetime}
            status={auction.status}
          />
        </div>
      </div>
      <div className="space-y-6">
        <ImageGallery title={title} media={koiMedia} />
        <AuctionItemCard
          auction={auction}
          koi={koi}
          onKoiLoading={koiIsLoading}
          onKoiError={koiIsError}
        />
      </div>
      <div className="space-y-6">
        <div className="hidden lg:block">
          <div className="mb-4 flex items-center space-x-2">
            <h2 className="m-0 text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h2>
            {getStatusBadge()}
          </div>
          {auction.description ?? <p className="">{auction.description}</p>}
          <br />
          <strong>Auction Period</strong>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
              <p className="text-md text-muted">Start : {startDate}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
              <p className="text-md text-muted">End : {endDate}</p>
            </div>
          </div>
          <Countdown
            className="mt-4 rounded-xl"
            size="default"
            startDate={auction.start_datetime}
            endDate={auction.end_datetime}
            status={auction.status}
          />
        </div>
        <Card>
          <CardContent className="grid gap-6 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-2xl font-bold sm:text-3xl">
                  {currentBid > 0
                    ? `Rp. ${currentBid.toLocaleString()}`
                    : "No bids yet"}
                </p>
              </div>

              <div className="w-full rounded-2xl border p-4 shadow-md sm:w-auto">
                <h3 className="m-0 text-base font-bold sm:text-lg">
                  Bidding Information
                </h3>
                <p className="text-sm sm:text-base">
                  Buy Now Price: {formatCurrency(reservePrice)}
                </p>
                <p className="text-sm sm:text-base">
                  Bid Increment: {formatCurrency(bidIncrement)}
                </p>
                <p className="text-sm sm:text-base">
                  Starting Bid Price: {formatCurrency(startingBidPrice)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{auction.participants.length} users participated</span>
              </div>
            </div>

            <Separator />

            {auction.status === AuctionStatus.PENDING ? (
              <div className="py-4 text-center">
                <p className="text-lg font-medium">
                  Auction ended, verifying winner
                </p>
              </div>
            ) : auction.status === AuctionStatus.COMPLETED &&
              auction.winner_id &&
              auction.winner ? (
              <div className="space-y-3 py-2">
                <p className="text-lg font-medium">Auction completed</p>
                <div className="rounded-md bg-muted p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <p className="font-semibold">
                      Winner: {auction.winner.username}
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    Winning bid:{" "}
                    {formatCurrency(
                      auction.final_price ?? auction.current_highest_bid,
                    )}
                  </p>
                </div>
              </div>
            ) : auction.status === AuctionStatus.CANCELLED ||
              auction.status === AuctionStatus.FAILED ? (
              <Button className="w-full" disabled>
                Auction Ended
              </Button>
            ) : !token ? (
              <Button asChild>
                <Link href="/login">Login to place a bid</Link>
              </Button>
            ) : (
              <PlaceBidForm
                title={auction.title}
                token={token}
                auctionID={auctionID}
                currentBid={currentBid}
                bidStartingPrice={Number(auction.bid_starting_price)}
                minIncrement={bidIncrement}
                isEnded={isAfter(new Date(), new Date(auction.end_datetime))}
                status={auction.status}
                participationFee={Number(auction.participation_fee)}
                userBalance={Number(user.data?.data.wallet.balance)}
                buyNowPrice={Number(auction.buynow_price)}
                hasJoined={auction.hasJoined}
                isBanned={isBanned}
              />
            )}

            <Separator />
          </CardContent>
        </Card>

        {!isNotStarted && (
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-semibold">Bid History</h2>
              <BidHistory bids={bids} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserContent;
