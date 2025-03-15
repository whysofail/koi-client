"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { TransactionStatus, TransactionType } from "@/types/transactionTypes";
import { useState } from "react";
import StatusBadge from "@/components/admin/transactions-table/StatusBadge";
import TypeBadge from "@/components/admin/transactions-table/TypeBadge";
import type { User } from "next-auth";
import { useTransactionDetailsViewModel } from "./TransactionDetails.viewModel";
import { format } from "date-fns";
import AcceptRejectTransactionButton from "@/components/admin/transaction-details-dialog/AcceptRejectDepositButton";
import TransactionDetailsSkeleton from "@/components/skeletons/TransactionDetailsSkeleton";
import BackButton from "@/components/dashboard/BackButton";
import { formatCurrency } from "@/lib/formatCurrency";

const IMAGE_URL = process.env.NEXT_PUBLIC_S3_URL || "";

const TransactionDetails = ({
  user,
  transactionId,
}: {
  user: User;
  transactionId: string;
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const isAdmin = user.role === "admin";

  const {
    transaction,
    isLoading,
    error,
    handleAcceptTransaction,
    handleRejectTransaction,
    isUpdatingTransaction,
  } = useTransactionDetailsViewModel(transactionId, user.accessToken);

  if (isLoading) return <TransactionDetailsSkeleton />;
  if (error || !transaction)
    return (
      <div className="py-8 text-center text-red-500">
        Error loading transaction or transaction not found.
      </div>
    );

  return (
    <>
      <BackButton />
      <div className="mx-auto sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Transaction Details
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="h-fit w-full ">
            <CardContent className="p-4 sm:p-6">
              <dl className="grid gap-3 sm:gap-4">
                {[
                  {
                    label: "Transaction ID",
                    value: transaction.transaction_id,
                  },
                  { label: "User ID", value: transaction.wallet.user.username },
                  {
                    label: "Amount",
                    value: formatCurrency(transaction.amount),
                  },
                  {
                    label: "Type",
                    value: <TypeBadge type={transaction.type} />,
                  },
                  {
                    label: "Status",
                    value: <StatusBadge status={transaction.status} />,
                  },
                  {
                    label: "Created At",
                    value: format(
                      new Date(transaction.created_at),
                      "dd/MM/yyyy : hh:mm a",
                    ),
                  },
                  {
                    label: "Updated At",
                    value: format(
                      new Date(transaction.updated_at),
                      "dd/MM/yyyy : hh:mm a",
                    ),
                  },
                  ...(isAdmin
                    ? [
                        {
                          label: "Admin",
                          value: transaction.admin?.username || "N/A",
                        },
                      ]
                    : []),
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="grid grid-cols-[1fr_auto] items-center gap-2 sm:gap-4"
                  >
                    <dt className="text-sm text-muted-foreground sm:text-base">
                      {label}:
                    </dt>
                    <dd className="text-right text-sm font-medium sm:text-base">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
            {isAdmin && transaction.status === TransactionStatus.PENDING && (
              <CardFooter className="flex flex-col justify-start gap-2 p-4 sm:flex-row">
                <AcceptRejectTransactionButton
                  onAccept={handleAcceptTransaction}
                  onReject={handleRejectTransaction}
                  isProcessing={isUpdatingTransaction}
                  type="accept"
                />
                <AcceptRejectTransactionButton
                  onAccept={handleAcceptTransaction}
                  onReject={handleRejectTransaction}
                  isProcessing={isUpdatingTransaction}
                  type="reject"
                />
              </CardFooter>
            )}
          </Card>

          {transaction.type === TransactionType.DEPOSIT &&
            transaction.proof_of_payment && (
              <Card className="w-full">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-4 text-lg font-semibold sm:text-xl">
                    Proof of Payment
                  </h3>
                  <Dialog
                    open={isImageExpanded}
                    onOpenChange={setIsImageExpanded}
                  >
                    <DialogTrigger asChild>
                      <div className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg">
                        <Image
                          src={`${IMAGE_URL}/${transaction.proof_of_payment}`}
                          alt="Proof of Payment"
                          fill
                          className="object-contain transition-transform hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl border-none bg-transparent shadow-none sm:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Proof of Payment
                        </DialogTitle>
                      </DialogHeader>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={`${IMAGE_URL}/${transaction.proof_of_payment}`}
                          alt="Proof of Payment"
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;
