import useAddWishlist from "@/server/wishlist/addToWishlist/mutation";
import useRemoveFromWishlist from "@/server/wishlist/removeFromWishlist/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import { useSearchParams } from "next/navigation";

interface UseWishlistCardViewModelProps {
  token?: string;
}

const useAuctionContentViewModel = ({
  token,
}: UseWishlistCardViewModelProps) => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const {
    data: auctionData,
    isLoading,
    isError,
  } = useGetAllAuctions({
    page: pageIndex,
    limit: pageSize,
    orderBy: AuctionOrderBy.CREATED_AT,
    order: "DESC",
    status: [AuctionStatus.PUBLISHED, AuctionStatus.STARTED],
    token: token ?? undefined,
  });

  const { mutate: addToWishlist, isPending: isPendingAdd } = useAddWishlist(
    token ?? "",
    queryClient,
  );
  const { mutate: removeFromWishlist, isPending: isPendingRemove } =
    useRemoveFromWishlist(token ?? "", queryClient);

  const handleAddToWishlist = (auctionId: string) => {
    addToWishlist(
      { auctionId },
      {
        onSettled: () => {
          toast.success("Added to wishlist");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };
  const handleRemoveFromWishlist = (auctionId: string) => {
    removeFromWishlist(
      { auctionId },
      {
        onSettled: () => {
          toast.success("Removed from wishlist");
        },
      },
    );
  };
  return {
    auctionData,
    isError,
    isLoading,
    isPendingAdd,
    handleAddToWishlist,
    isPendingRemove,
    handleRemoveFromWishlist,
  };
};

export default useAuctionContentViewModel;
