import React from "react";
import { Auction } from "@/types/auctionTypes";
import { Bid } from "@/types/bidTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Clock, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGallery from "./ImageGallery";
import { BidHistory } from "./BidHistory";
import { AuctionParticipant } from "@/types/auctionParticipantTypes";
import { formatDistanceToNow } from "date-fns";

interface AdminContentProps {
  auction: Auction;
  bids: Bid[];
  title: string;
  currentBid: string;
  reservePrice: string;
  bidIncrement: string;
}

const AdminContent: React.FC<AdminContentProps> = ({
  auction,
  bids,
  title,
  currentBid,
  reservePrice,
  bidIncrement,
}) => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <ImageGallery title={title} />
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Current Bid</p>
                  <p className="text-2xl font-bold">
                    {Number.parseFloat(currentBid) > 0
                      ? `Rp. ${Number.parseFloat(currentBid).toLocaleString()}`
                      : "No bids yet"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reserve Price</p>
                  <p className="text-2xl font-bold">
                    Rp. {Number.parseFloat(reservePrice.toLocaleString())}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="bids">
          <TabsList>
            <TabsTrigger value="bids">Bid History</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="bids">
            <Card>
              <CardContent className="p-6">
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
                <p>2 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Bid Increment</p>
                <p>Rp. {Number.parseFloat(bidIncrement.toLocaleString())}</p>
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
