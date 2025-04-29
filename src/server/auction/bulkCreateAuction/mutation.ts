import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const bulkCreateAuctions = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchWithAuth.post("/auctions/bulk-create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // not { data: response }, fix this
};

const useBulkCreateAuctions = (token: string) =>
  useMutation({
    mutationFn: async (file: File) => {
      return await bulkCreateAuctions(token, file);
    },
  });

export default useBulkCreateAuctions;
