import { QueryClient } from "@tanstack/react-query";
import useJoinAuction from "@/server/auction/joinAuction/mutation";
import { toast } from "sonner";

const useJoinAuctionDialogViewModel = (token: string, auctionID: string) => {
  const queryClient = new QueryClient();

  const { mutateAsync: joinAuction, isPending } = useJoinAuction(
    token,
    queryClient,
  );
  const handleJoinAuction = async () => {
    try {
      await joinAuction({ auctionID });
      toast.success("Successfully joined auction");
    } catch (error) {
      toast.error("Failed to join auction");
      console.error("Failed to join auction:", error);
    }
  };

  return {
    isPending,
    handleJoinAuction,
  };
};

export default useJoinAuctionDialogViewModel;
