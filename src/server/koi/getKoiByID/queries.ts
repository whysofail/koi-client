import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Koi } from "@/types/koiTypes";

const fetchKoiByID = async (koiID: string): Promise<Koi> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_LARAVEL_URL}/api/kois/${koiID}`,
    {
      headers: {
        "x-api-key": process.env.KOI_HEADERS,
      },
    },
  );

  return data;
};

const useGetKoiByID = (koiID: string) =>
  useQuery({
    queryKey: ["koiData", koiID],
    queryFn: () => fetchKoiByID(koiID),
  });

export default useGetKoiByID;
