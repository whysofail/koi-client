import { useQuery } from "@tanstack/react-query";
import { GetStatsResponse } from "@/types/statsTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const fetchStats = async (token: string) => {
  const { data } = await fetchWithAuth.get<GetStatsResponse>("/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const useGetStats = (token: string) =>
  useQuery({
    queryKey: ["stats", token],
    queryFn: () => fetchStats(token),
  });

export default useGetStats;
