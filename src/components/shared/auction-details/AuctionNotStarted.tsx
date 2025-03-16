"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface AuctionNotStartedProps {
  startDateTime: string;
  isLoggedIn: boolean;
}

const AuctionNotStarted = ({
  startDateTime,
  isLoggedIn,
}: AuctionNotStartedProps) => {
  const formattedDate = format(new Date(startDateTime), "dd MMMM yyyy");
  const formattedTime = format(new Date(startDateTime), "HH:mm O");

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <CalendarClock className="h-12 w-12 text-primary" />
        <h3 className="text-xl font-semibold">Auction Not Started Yet</h3>
        <p className="text-muted-foreground">
          This auction will begin on{" "}
          <span className="font-medium">{formattedDate}</span> at{" "}
          <span className="font-medium">{formattedTime}</span>
        </p>
        {!isLoggedIn && (
          <div className="mt-2">
            <Button asChild>
              <Link href="/login">Login to Participate</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionNotStarted;
