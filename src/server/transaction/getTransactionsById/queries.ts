import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { TransactionByIDResponse } from "@/types/transactionTypes";
import { useQuery } from "@tanstack/react-query";

const getTransactionID = async (id: string, token: string) => {
  const { data } = await fetchWithAuth.get<TransactionByIDResponse>(
    `/transactions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

const useGetTransactionByID = (
  id: string,
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransactionID(id, token),
    enabled: options?.enabled,
  });
};

export default useGetTransactionByID;
