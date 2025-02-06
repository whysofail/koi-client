import React from "react";
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
import { FC } from "react";

interface UnbanUserButtonProps {
  onUnban: () => void;
  isUnbanning: boolean;
}

const UnbanUserButton: FC<UnbanUserButtonProps> = ({
  onUnban,
  isUnbanning,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          <Ban className="mr-2 h-4 w-4" />
          Unban User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unban User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unban this user? They will regain access to
            their account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onUnban} disabled={isUnbanning}>
            {isUnbanning ? "Unbanning..." : "Unban User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnbanUserButton;
