import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CreateAuctionBody } from "@/types/auctionTypes";

const getDefaultDates = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7); // Default to 7 days from now
  return {
    start_datetime: start.toISOString(),
    end_datetime: end.toISOString(),
  };
};

const createAuctionDraft = async (token: string, data: CreateAuctionBody) => {
  const defaultDates = getDefaultDates();
  const auctionData = {
    ...data,
    start_datetime: defaultDates.start_datetime,
    end_datetime: defaultDates.end_datetime,
  };

  const { data: response } = await fetchWithAuth.post(
    "/auctions",
    auctionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useCreateAuctionDraft = (token: string) => {
  return useMutation({
    mutationFn: (data: CreateAuctionBody) => createAuctionDraft(token, data),
    onError: (error) => {
      console.error("Failed to create auction:", error);
    },
  });
};

export default useCreateAuctionDraft;
