import { useQuery } from "@tanstack/react-query";
import { KoiData } from "@/types/koiTypes";
import axios from "axios";

export const fetchKoiData = async () => {
  const { data } = await axios.get(
    `${process.env.KOI_URL}/api/kois?page=&per_page/api/kois?page=&per_page`,
    {
      headers: {
        "x-api-key": process.env.KOI_HEADERS,
      },
    },
  );

  return data as KoiData;
};

const useGetKoiData = () =>
  useQuery({
    queryKey: ["koiData"],
    queryFn: fetchKoiData,
  });

export default useGetKoiData;
