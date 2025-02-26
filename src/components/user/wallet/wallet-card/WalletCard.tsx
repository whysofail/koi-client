"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import useWalletCardViewModel from "./WalletCard.viewModel";
import { formatCurrency } from "@/lib/formatCurrency";
import { FC } from "react";

type WalletCardProps = {
  token: string;
};

const WalletCard: FC<WalletCardProps> = ({ token }) => {
  const { data, isLoading, error } = useWalletCardViewModel(token);
  if (isLoading) return <div>Loading wallet...</div>;
  if (error || !data)
    return <div>Failed to load wallet. Please try again later.</div>;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Wallet Information
        </CardTitle>
        <Wallet className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="grid gap-1.5">
            <p className="text-muted-foreground text-sm">Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(data.balance)}</p>
          </div>
          <div className="grid gap-1.5">
            <p className="text-muted-foreground text-sm">Last Updated</p>
            <p className="text-sm font-medium">
              {format(new Date(data.updated_at), "PPPPpp")}
            </p>
          </div>
          <div className="grid-flow-row space-x-4">
            <Button variant="default">
              <Link href="/dashboard/transactions/deposit" passHref>
                Top Up
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
