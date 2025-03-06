import useGetLoggedInUserWishlist from "@/server/wishlist/getLoggedInUserWishlist/queries";
import { User } from "next-auth";
import useAddWishlist from "@/server/wishlist/addToWishlist/mutation";
import useRemoveFromWishlist from "@/server/wishlist/removeFromWishlist/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseWishlistCardViewModelProps {
  user: User;
}

const WishlistCardViewModel = ({ user }: UseWishlistCardViewModelProps) => {
  const queryClient = useQueryClient();

  const { data: wishlistData, isLoading } = useGetLoggedInUserWishlist(
    user.accessToken,
  );

  const { mutate: addToWishlist, isPending: isPendingAdd } = useAddWishlist(
    user.accessToken,
    queryClient,
  );
  const { mutate: removeFromWishlist, isPending: isPendingRemove } =
    useRemoveFromWishlist(user.accessToken, queryClient);

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
    wishlistData,
    isLoading,
    isPendingAdd,
    handleAddToWishlist,
    isPendingRemove,
    handleRemoveFromWishlist,
  };
};

export default WishlistCardViewModel;
