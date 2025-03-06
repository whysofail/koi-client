import { useQueryClient } from "@tanstack/react-query";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { toast } from "sonner";
import { AuctionStatus } from "@/types/auctionTypes";
import { KoiStatus } from "@/types/koiTypes";
import { PaginatedResponse, Koi } from "@/types/koiTypes";
import { getErrorMessage } from "@/lib/handleApiError";
import { useState } from "react";

const AdminControlsViewModel = (token: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const { mutate: updateKoiStatus, isPending: pendingUpdate } =
    useUpdateKoi(queryClient);
  const { mutate: updateMutate, isPending: pendingUpdateKoiStatus } =
    useUpdateAuction(token, queryClient);
  const [open, setOpen] = useState(false);

  const handleCancelAuction = async (
    auctionId: string,
    bid_increment: string,
    reserve_price: string,
    koiId: string,
  ) => {
    try {
      await queryClient.cancelQueries({ queryKey: ["allAuctions"] });
      await queryClient.cancelQueries({ queryKey: ["koiData"] });

      const previousAuctions =
        queryClient.getQueryData<any[]>(["allAuctions"]) ?? [];
      const previousKoiData = queryClient.getQueryData<PaginatedResponse<Koi>>([
        "koiData",
      ]);

      const originalKoiStatus = previousKoiData?.data?.find(
        (koi) => koi.id === koiId,
      )?.status;

      if (previousKoiData?.data) {
        queryClient.setQueryData<PaginatedResponse<Koi>>(["koiData"], (old) => {
          if (!old?.data) return old ?? previousKoiData;
          return {
            ...old,
            data: old.data.map((koi) =>
              koi.id === koiId ? { ...koi, status: KoiStatus.AUCTION } : koi,
            ),
          };
        });
      }

      queryClient.setQueryData<any[]>(["allAuctions"], (old) => {
        return (old ?? []).map((auction) =>
          auction.id === auctionId
            ? {
                ...auction,
                status: AuctionStatus.CANCELLED,
                bid_increment,
                reserve_price,
              }
            : auction,
        );
      });

      let koiUpdateSuccess = false;

      try {
        await new Promise<void>((resolve, reject) =>
          updateKoiStatus(
            {
              koiId,
              koiStatus: KoiStatus.AUCTION,
            },
            {
              onSuccess: () => {
                koiUpdateSuccess = true;
                resolve();
              },
              onError: reject,
            },
          ),
        );

        await new Promise<void>((resolve, reject) =>
          updateMutate(
            {
              auctionId,
              data: {
                status: AuctionStatus.CANCELLED,
                bid_increment,
                reserve_price,
              },
            },
            {
              onSuccess: resolve,
              onError: (error) => {
                if (koiUpdateSuccess && originalKoiStatus) {
                  updateKoiStatus(
                    {
                      koiId,
                      koiStatus: originalKoiStatus,
                    },
                    {
                      onSettled: () => reject(error),
                    },
                  );
                } else {
                  reject(error);
                }
              },
            },
          ),
        );

        toast.success("Auction cancelled");
        onSuccess?.();
      } catch (error) {
        queryClient.setQueryData(["allAuctions"], previousAuctions);
        queryClient.setQueryData(["koiData"], previousKoiData);
        throw error;
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("Operation failed to execute", error);
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["allAuctions"] }),
        queryClient.invalidateQueries({ queryKey: ["koiData"] }),
      ]);
    }
  };

  const isCanceling = pendingUpdate || pendingUpdateKoiStatus;

  return {
    handleCancelAuction,
    pendingCancel: isCanceling,
    open,
    setOpen,
  };
};

export default AdminControlsViewModel;
