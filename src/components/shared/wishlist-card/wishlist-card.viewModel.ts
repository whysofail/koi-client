import useGetLoggedInUserWishlist from "@/server/wishlist/getLoggedInUserWishlist/queries";
import { User } from "next-auth";

interface UseWishlistCardViewModelProps {
  user: User;
}

const WishlistCardViewModel = ({ user }: UseWishlistCardViewModelProps) => {
  const { data: wishlistData, isLoading } = useGetLoggedInUserWishlist(
    user.accessToken,
  );

  return {
    wishlistData,
    isLoading,
  };
};

export default WishlistCardViewModel;
