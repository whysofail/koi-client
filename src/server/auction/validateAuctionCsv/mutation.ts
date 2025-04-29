import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const validateAuctionCsv = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth.post(
    "/auctions/bulk-create/validate",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data; // fix here (not { data: response })
};

const useValidateAuctionCsv = (token: string) =>
  useMutation({
    mutationFn: async (file: File) => {
      return await validateAuctionCsv(token, file);
    },
  });

export default useValidateAuctionCsv;
