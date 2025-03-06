import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { Wishlist } from "@/types/wishlistTypes";
import { PaginatedResponse } from "@/types/baseType";

const getLoggedInUserWishlist = async (token: string) => {
  const { data } = await fetchWithAuth.get<PaginatedResponse<Wishlist>>(
    `/wishlists`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetLoggedInUserWishlist = (
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["Wishlist"],
    queryFn: () => getLoggedInUserWishlist(token),
    enabled: options?.enabled,
  });
};

export default useGetLoggedInUserWishlist;
