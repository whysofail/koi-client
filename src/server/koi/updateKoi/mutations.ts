//TODO: UPDATE KOI IMPLEMENTATION ON SALE
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage } from "@/lib/handleApiError";

const updateKoi = async (koiId: string, koiStatus: string) => {
  const { data } = await axios.put(
    `http://localhost:8000/api/kois/${koiId}`,
    {
      status: koiStatus,
    },
    {
      headers: {
        "x-api-key": process.env.KOI_HEADERS,
      },
    },
  );

  return data;
};

const useUpdateKoi = () =>
  useMutation({
    mutationFn: async ({
      koiId,
      koiStatus,
    }: {
      koiId: string;
      koiStatus: string;
    }) => {
      try {
        return await updateKoi(koiId, koiStatus);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onError: (error) => {
      console.error("Failed to update koi:", error);
    },
  });

export default useUpdateKoi;
