import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CreateAuctionBody } from "@/types/auctionTypes";
import { getErrorMessage } from "@/lib/handleApiError";

const getDefaultDates = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 7);
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

const useCreateAuctionDraft = (token: string) =>
  useMutation({
    mutationFn: async (data: CreateAuctionBody) => {
      try {
        return await createAuctionDraft(token, data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      console.error("Failed to create auction:", error);
    },
  });

export default useCreateAuctionDraft;
