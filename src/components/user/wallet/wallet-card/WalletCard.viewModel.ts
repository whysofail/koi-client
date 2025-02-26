import useGetLoggedInUserWallet from "@/server/wallet/getLoggedInUserWallet/queries";

const useWalletCardViewModel = (token: string) => {
  const {
    data: walletData,
    isLoading,
    error,
  } = useGetLoggedInUserWallet(token);

  return {
    data: walletData?.data,
    isLoading,
    error,
  };
};

export default useWalletCardViewModel;
