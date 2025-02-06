import React, { FC } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AcceptRejectTransactionButtonProps {
  onAccept: () => void;
  onReject: () => void;
  isProcessing: boolean;
  type: "accept" | "reject";
}

const AcceptRejectTransactionButton: FC<AcceptRejectTransactionButtonProps> = ({
  onAccept,
  onReject,
  isProcessing,
  type,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={type === "accept" ? "default" : "destructive"}>
          {type === "accept" ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          {type === "accept" ? "Accept" : "Reject"} Transaction
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {type === "accept" ? "Accept Transaction" : "Reject Transaction"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {type === "accept" ? "accept" : "reject"}{" "}
            this transaction? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={type === "accept" ? onAccept : onReject}
            disabled={isProcessing}
          >
            {isProcessing
              ? `${type === "accept" ? "Accepting" : "Rejecting"}...`
              : type === "accept"
                ? "Accept Transaction"
                : "Reject Transaction"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AcceptRejectTransactionButton;
