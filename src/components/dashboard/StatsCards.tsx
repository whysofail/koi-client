"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  DollarSign,
  // TrendingUp,
  Gavel,
  Timer,
  Heart,
} from "lucide-react";
import useGetStats from "@/server/stats/getStats/queries";
import Link from "next/link";

interface StatsCardsProps {
  isAdmin: boolean;
  token: string;
}

const StatsCards = ({ isAdmin, token }: StatsCardsProps) => {
  const { data, isLoading, isError } = useGetStats(token);

  if (isLoading) return <div>Loading stats...</div>;
  if (isError) return <div>Failed to load stats. Please try again later.</div>;
  if (isAdmin) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Link href={"/dashboard/users"} passHref>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.data.userTotal}</div>
              <p className="text-muted-foreground text-xs">
                +{data?.data.userTotalThisWeek} new this week
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href={"/dashboard/auctions"} passHref>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Auctions
              </CardTitle>
              <Package className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data.auctionsActive}
              </div>
              <p className="text-muted-foreground text-xs">
                {data?.data.auctionsEndingSoon} ending today
              </p>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <Link href="/dashboard/transactions" passHref>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Deposits
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data.depositsTotal}
              </div>
              <p className="text-muted-foreground text-xs">
                +12% from last month
              </p>
            </CardContent>
          </Link>
        </Card>
        <Link href={"/dashboard/transactions"} passHref>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Deposits
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.data.depositsPendingTotal}
              </div>
              <p className="text-muted-foreground text-xs">
                These deposits are awaiting verification. Action required.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
          <Gavel className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-muted-foreground text-xs">+2 from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Listings</CardTitle>
          <Package className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-muted-foreground text-xs">+3 new today</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Watched Items</CardTitle>
          <Heart className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-muted-foreground text-xs">3 ending soon</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Ending</CardTitle>
          <Timer className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2h 15m</div>
          <p className="text-muted-foreground text-xs">Vintage Watch</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
