import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
    mutationFn: ({ koiId, koiStatus }: { koiId: string; koiStatus: string }) =>
      updateKoi(koiId, koiStatus),
  });

export default useUpdateKoi;
