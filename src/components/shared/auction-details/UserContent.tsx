import React from "react";
import ImageGallery from "./ImageGallery";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, Info, Truck, User } from "lucide-react";
import { BidHistory } from "./BidHistory";
import { Auction, AuctionStatus } from "@/types/auctionTypes";
import { Bid } from "@/types/bidTypes";
import { Separator } from "@/components/ui/separator";
import PlaceBidForm from "./PlaceBidForm";
interface GalleryImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}
interface UserContentProps {
  token: string;
  auction: Auction;
  auctionID: string;
  bids: Bid[];
  title: string;
  images?: GalleryImage[];
}

const UserContent: React.FC<UserContentProps> = ({
  token,
  auction,
  auctionID,
  bids,
  title,
  images,
}) => {
  const currentBid = Number(auction.current_highest_bid);
  const reservePrice = Number(auction.reserve_price);
  const bidIncrement = Number(auction.bid_increment);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ImageGallery title={title} images={images} />
      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Current Bid</p>
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
                QueryClient
                <Clock className="text-muted-foreground h-4 w-4" />
                <span>Ends in 2 days</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-4 w-4" />
                <span>{auction.participants.length} watching</span>
              </div>
            </div>

            <Separator />

            <PlaceBidForm
              token={token}
              auctionID={auctionID}
              currentBid={currentBid}
              minIncrement={bidIncrement}
              isEnded={
                auction.status === AuctionStatus.PENDING ||
                auction.status === AuctionStatus.COMPLETED
              }
            />

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="font-medium">Shipping Available</p>
                  <p className="text-muted-foreground text-sm">
                    Calculated at checkout
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="font-medium">Secure Payment</p>
                  <p className="text-muted-foreground text-sm">
                    Major credit cards accepted
                  </p>
                </div>
              </div>
            </div>
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
