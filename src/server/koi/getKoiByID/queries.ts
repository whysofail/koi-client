import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Koi } from "@/types/koiTypes";

const fetchKoiByID = async (koiID: string) => {
  const { data } = await axios.get<Koi>(
    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/koi?id=${koiID}`,
  );
  return data;
};

const useGetKoiByID = (koiID: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["koiData"],
    queryFn: () => fetchKoiByID(koiID),
    enabled: options?.enabled,
  });

export default useGetKoiByID;
