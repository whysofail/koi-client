import React, { FC } from "react";
import { Ban } from "lucide-react";
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

interface BanUserButtonProps {
  onBan: () => void;
  isBanning: boolean;
}
const BanUserButton: FC<BanUserButtonProps> = ({ onBan, isBanning }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Ban className="mr-2 h-4 w-4" />
          Ban User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to ban this user? They will not be able to
            access their account until unbanned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onBan} disabled={isBanning}>
            {isBanning ? "Banning..." : "Ban User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanUserButton;
