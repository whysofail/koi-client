import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getErrorMessage } from "@/lib/handleApiError";
import { KoiStatus } from "@/types/koiTypes";

const updateKoi = async (
  koiId: string,
  koiStatus: KoiStatus,
  buyerName?: string,
  sell_date?: string,
) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/koi`,
    {
      koiId,
      status: koiStatus,
      buyer_name: buyerName,
      sell_date: sell_date,
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
      sell_date,
    }: {
      koiId: string;
      koiStatus: KoiStatus;
      buyerName?: string;
      sell_date?: string;
    }) => {
      try {
        return await updateKoi(koiId, koiStatus, buyerName, sell_date);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onMutate: async ({ koiId, koiStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["koiData"] });
      const previousKoiData = queryClient.getQueryData(["koiData"]);

      if (previousKoiData) {
        queryClient.setQueryData(["koiData"], (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: old.data.map((koi: any) =>
              koi.id === koiId ? { ...koi, status: koiStatus } : koi,
            ),
          };
        });
      }

      return { previousKoiData };
    },
    onError: (_, __, context) => {
      if (context?.previousKoiData) {
        queryClient.setQueryData(["koiData"], context.previousKoiData);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["koiData"] });
    },
  });

export default useUpdateKoi;
