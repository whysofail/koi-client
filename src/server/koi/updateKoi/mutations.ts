import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage } from "@/lib/handleApiError";
import { KoiStatus } from "@/types/koiTypes";

const updateKoi = async (
  koiId: string,
  koiStatus: KoiStatus,
  buyerName?: string,
) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/kois/${koiId}`,
    {
      status: koiStatus,
      ...(buyerName && { buyer_name: buyerName }),
    },
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_KOI_HEADERS,
      },
    },
  );

  return data;
};

const useUpdateKoi = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async ({
      koiId,
      koiStatus,
      buyerName,
    }: {
      koiId: string;
      koiStatus: KoiStatus;
      buyerName?: string;
    }) => {
      try {
        return await updateKoi(koiId, koiStatus, buyerName);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onError: (error) => {
      console.error("Failed to update koi:", error);
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["allKois"] });
    },
  });

export default useUpdateKoi;
