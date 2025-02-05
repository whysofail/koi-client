"use client";

import { useState } from "react";
import Image from "next/image";
import {
  type Transaction,
  TransactionType,
  TransactionStatus,
} from "@/types/transactionTypes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User } from "next-auth";
import useGetTransactionByID from "@/server/transaction/getTransactionsById/queries";

interface TransactionDetailsProps {
  user: User;
  transactionId: string;
  onApprove?: (transactionId: string) => void;
  onReject?: (transactionId: string) => void;
}

export default function TransactionDetails({
  user,
  transactionId,
  onApprove,
  onReject,
}: TransactionDetailsProps) {
  const isAdmin = user.role === "admin";
  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionByID(transactionId, user.accessToken);
  const IMAGE_URL = process.env.NEXT_PUBLIC_S3_URL;
  const transaction: Transaction | undefined = transactions?.data;
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStatusBadge = (status: TransactionStatus) => {
    const statusColors = {
      [TransactionStatus.PENDING]: "bg-yellow-500",
      [TransactionStatus.COMPLETED]: "bg-green-500",
      [TransactionStatus.FAILED]: "bg-red-500",
      [TransactionStatus.APPROVED]: "bg-blue-500",
      [TransactionStatus.REJECTED]: "bg-gray-500",
    };

    return (
      <Badge className={`${statusColors[status]} text-white`}>{status}</Badge>
    );
  };

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (isError || !transaction)
    return <div>Error loading transaction or transaction not found.</div>;

  return (
    <Card className="mx-12 w-full max-w-screen-md">
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
        <CardDescription>
          Transaction ID: {transaction.transaction_id}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Amount:</span>
          <span className="font-semibold">{transaction.amount}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span>{transaction.type}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          {renderStatusBadge(transaction.status)}
        </div>
        <div className="flex justify-between">
          <span>Created At:</span>
          <span>{formatDate(transaction.created_at)}</span>
        </div>
        <div className="flex justify-between">
          <span>Updated At:</span>
          <span>{formatDate(transaction.updated_at)}</span>
        </div>

        {transaction.type === TransactionType.DEPOSIT &&
          transaction.proof_of_payment && (
            <div>
              <h3 className="mb-2 font-semibold">Proof of Payment</h3>
              <p>{transaction.proof_of_payment}</p>

              <p>
                img uri : {IMAGE_URL}/{transaction.proof_of_payment}
              </p>

              <Dialog open={isImageExpanded} onOpenChange={setIsImageExpanded}>
                <DialogTrigger asChild>
                  <Button variant="outline">View Proof of Payment</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Proof of Payment</DialogTitle>
                  </DialogHeader>

                  <Image
                    src={
                      `${IMAGE_URL}/${transaction.proof_of_payment}` ||
                      "/placeholder.svg"
                    }
                    style={{ objectFit: "contain" }}
                    alt="Proof of Payment"
                    width={800}
                    height={600}
                    objectFit="contain" // Use "contain" for better fitting without clipping
                    className="mx-auto h-auto max-h-[80vh] w-full"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

        {(transaction.type === TransactionType.DEPOSIT ||
          transaction.type === TransactionType.WITHDRAWAL) && (
          <div>
            <h3 className="mb-2 font-semibold">Additional Information</h3>
            <p>
              {transaction.type === TransactionType.DEPOSIT
                ? "Deposit"
                : "Withdrawal"}{" "}
              details go here...
            </p>
          </div>
        )}
        {transaction.type === TransactionType.TRANSFER && (
          <div>
            <h3 className="mb-2 font-semibold">Transfer Details</h3>
            <p>Recipient: {transaction.recipient?.username || "N/A"}</p>
          </div>
        )}
        {transaction.type === TransactionType.PARTICIPATE && (
          <div>
            <h3 className="mb-2 font-semibold">Participation Details</h3>
            <p>Event: {transaction.event?.name || "N/A"}</p>
          </div>
        )}
      </CardContent>

      {isAdmin &&
        (transaction.type === TransactionType.DEPOSIT ||
          transaction.type === TransactionType.WITHDRAWAL) &&
        transaction.status === TransactionStatus.PENDING && (
          <CardFooter className="space-x-2">
            <Button
              onClick={() => onApprove?.(transaction.transaction_id)}
              variant="default"
            >
              Approve
            </Button>
            <Button
              onClick={() => onReject?.(transaction.transaction_id)}
              variant="destructive"
            >
              Reject
            </Button>
          </CardFooter>
        )}
    </Card>
  );
}
