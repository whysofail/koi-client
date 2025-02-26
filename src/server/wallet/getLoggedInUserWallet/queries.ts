import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { GetDetailedWalletResponse } from "@/types/walletTypes";

const getLoggedInUserWallet = async (token: string) => {
  const { data } = await fetchWithAuth.get<GetDetailedWalletResponse>(
    `/wallets/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetLoggedInUserWallet = (
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => getLoggedInUserWallet(token),
    enabled: options?.enabled,
  });
};

export default useGetLoggedInUserWallet;
