import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/koiTypes";
import axios from "axios";

interface FetchKoiParams {
  page?: number;
  per_page?: number;
}

const fetchKoiData = async ({
  page = 1,
  per_page = 10,
}: FetchKoiParams = {}): Promise<PaginatedResponse> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/kois?page=${page}&per_page=${per_page}&status=auction`,
    {
      headers: {
        "x-api-key": process.env.KOI_HEADERS,
      },
    },
  );

  return data;
};

const useGetKoiData = (params: FetchKoiParams = {}) =>
  useQuery({
    queryKey: ["koiData", params],
    queryFn: () => fetchKoiData(params),
  });

export default useGetKoiData;
