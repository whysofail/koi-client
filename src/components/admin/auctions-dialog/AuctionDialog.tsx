"use client";

import type { ReactNode } from "react";
import type React from "react";
import PublishDialog from "./PublishDialog";
import RepublishAuctionDialog from "./RepublishDialog"; // Use the new component
import DeleteDialog from "./DeleteDialog";
import CancelDialog from "./CancelDialog";
import UnpublishDialog from "./UnpublishDialog";

type AuctionAlertDialogProps = {
  operation: "publish" | "delete" | "cancel" | "unpublish" | "republish";
  bid_increment: string;
  buynow_price: string;
  auction_id: string;
  token: string;
  koiId?: string;
  children?: ReactNode;
  button?: boolean;
  start_datetime?: string;
  end_datetime?: string;
};

const AuctionDialog: React.FC<AuctionAlertDialogProps> = (props) => {
  const {
    operation,
    bid_increment,
    buynow_price,
    auction_id,
    token,
    koiId,
    children,
    button = false,
    start_datetime = "",
    end_datetime = "",
  } = props;

  // Return the appropriate dialog based on operation
  switch (operation) {
    case "publish":
      return (
        <PublishDialog
          token={token}
          auction_id={auction_id}
          bid_increment={bid_increment}
          buynow_price={buynow_price}
          button={button}
          start_datetime={start_datetime}
          end_datetime={end_datetime}
        >
          {children}
        </PublishDialog>
      );

    case "republish":
      return (
        <RepublishAuctionDialog
          token={token}
          auction_id={auction_id}
          koiId={koiId || ""}
          bid_increment={bid_increment}
          buynow_price={buynow_price}
          button={button}
          start_datetime={start_datetime}
          end_datetime={end_datetime}
        >
          {children}
        </RepublishAuctionDialog>
      );

    case "delete":
      return (
        <DeleteDialog token={token} auction_id={auction_id} koiId={koiId || ""}>
          {children}
        </DeleteDialog>
      );

    case "cancel":
      return (
        <CancelDialog
          token={token}
          auction_id={auction_id}
          koiId={koiId || ""}
          bid_increment={bid_increment}
          buynow_price={buynow_price}
        >
          {children}
        </CancelDialog>
      );
    case "unpublish":
      return (
        <UnpublishDialog
          token={token}
          auction_id={auction_id}
          koiId={koiId || ""}
        >
          {children}
        </UnpublishDialog>
      );

    default:
      return null;
  }
};

export default AuctionDialog;
