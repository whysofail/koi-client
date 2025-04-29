import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useBulkCreateAuctions from "@/server/auction/bulkCreateAuction/mutation";
import useValidateAuctionCsv from "@/server/auction/validateAuctionCsv/mutation";
import useGetKoiData from "@/server/koi/getAllKois/queries";
import Papa from "papaparse";
import { z } from "zod";
// import zonedTimeToUtc from "@/lib/parseToUTC";
import { utils, read } from "xlsx";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { Koi, KoiStatus } from "@/types/koiTypes";
import { toast } from "sonner";

// Define schema
const AuctionRowSchema = z.object({
  item: z.preprocess(
    (val) => (val == null ? "" : String(val).trim()),
    z.string().min(1, { message: "Item must not be empty." }),
  ),

  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  buynow_price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Buy now price must be a number." }),
  ),
  participation_fee: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Participation fee must be a number." }),
  ),
  bid_starting_price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Bid starting price must be a number." }),
  ),
  bid_increment: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Bid increment must be a number." }),
  ),
  start_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date.",
  }),
  end_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date.",
  }),
});

// Types
export type AuctionRow = z.infer<typeof AuctionRowSchema>;

export interface AuctionRowWithError extends AuctionRow {
  error: ValidationError;
}

export type ValidationError = {
  row: number;
  issues: string[];
};

export function useAuctionCsvUploader(
  token: string,
  // timezone = "Asia/Jakarta",
) {
  const queryClient = useQueryClient();
  const updateKoiMutation = useUpdateKoi(queryClient);

  const [data, setData] = useState<AuctionRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isKoiLoading, setIsKoiLoading] = useState(false);
  const [koiItems, setKoiItems] = useState<Koi[]>([]);

  const validateAuctionCsvMutation = useValidateAuctionCsv(token);
  const { mutateAsync, isSuccess, isPending, isError } =
    useBulkCreateAuctions(token);

  // Initialize useGetKoiData but with enabled:false so it doesn't fetch on mount
  const getKoiQuery = useGetKoiData({
    per_page: 9999,
    // enabled: false,
  });

  const reset = () => {
    setData([]);
    setErrors([]);
    setFile(null);
    setIsUploading(false);
    const inputField = document.getElementById("csv-file") as HTMLInputElement;
    if (inputField) inputField.value = "";
  };

  const validateAuction = async (
    file: File,
    clientErrors: ValidationError[],
  ) => {
    try {
      const response = await validateAuctionCsvMutation.mutateAsync(file);
      console.log("Validation result", response);

      // Combine client errors with server validation errors
      if (response?.errors) {
        const combinedErrors = [...clientErrors, ...response.errors];

        // Remove duplicates based on row number and issues content
        const uniqueErrors = combinedErrors.filter(
          (error, index, self) =>
            index ===
            self.findIndex(
              (e) =>
                e.row === error.row &&
                JSON.stringify(e.issues.sort()) ===
                  JSON.stringify(error.issues.sort()),
            ),
        );

        setErrors(uniqueErrors);
      } else {
        // If no server errors, just keep the client errors
        setErrors(clientErrors);
      }

      return response;
    } catch (error) {
      console.error("Validation failed", error);
      const serverError = { row: -1, issues: ["Server validation failed."] };
      const combinedErrors = [...clientErrors, serverError];
      setErrors(combinedErrors);
      return { errors: [serverError] };
    }
  };

  const validateRow = (
    row: any,
    index: number,
    fileExtension: string,
  ): { validRow?: AuctionRow; invalidRow?: AuctionRowWithError } => {
    const result = AuctionRowSchema.safeParse(row);

    const rowNumber = index + (fileExtension === "csv" ? 2 : 2); // (you can remove the ternary later, they're same)

    if (result.success) {
      const { item } = result.data;

      const koiItem = koiItems.find((koi) => String(koi.id) === item);
      console.log("koiItem", koiItem);
      console.log("item", item);
      console.log("koiItems", koiItems);
      const issues: string[] = [];
      if (!koiItem && koiItem === undefined) {
        issues.push(`Koi item "${item}" does not available for auction.`);
      } else if (koiItem.status !== KoiStatus.AUCTION) {
        issues.push(
          `Koi item "${item}" is not available for auction (current status: ${koiItem.status}).`,
        );
      }
      if (issues.length > 0) {
        return {
          invalidRow: {
            ...result.data,
            error: {
              row: rowNumber,
              issues,
            },
          },
        };
      }

      return {
        validRow: {
          ...result.data,
          // start_datetime: zonedTimeToUtc(
          //   result.data.start_datetime,
          //   timezone,
          // ).toISOString(),
          // end_datetime: zonedTimeToUtc(
          //   result.data.end_datetime,
          //   timezone,
          // ).toISOString(),
        },
      };
    } else {
      return {
        invalidRow: {
          ...row,
          error: {
            row: rowNumber,
            issues: result.error.errors.map((e) => e.message),
          },
        },
      };
    }
  };

  const processFileData = (
    parsedRows: Record<string, any>[],
    fileExtension: string,
  ) => {
    if (parsedRows.length === 0) {
      return {
        data: [],
        errors: [{ row: -1, issues: ["The uploaded file is empty."] }],
      };
    }

    const validData: AuctionRow[] = [];
    const invalidData: AuctionRowWithError[] = [];
    const validationErrors: ValidationError[] = [];

    parsedRows.forEach((row, index) => {
      // Ensure 'item' is treated as a string
      if (typeof row.item === "number") {
        row.item = String(row.item);
      }

      // Validate the row
      const { validRow, invalidRow } = validateRow(row, index, fileExtension);
      if (validRow) {
        validData.push(validRow);
      } else if (invalidRow) {
        invalidData.push(invalidRow);
        validationErrors.push(invalidRow.error);
      }
    });

    return {
      data: [...validData, ...invalidData],
      errors: validationErrors,
    };
  };

  const handleFileChange = async (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
    setFileType(fileExtension);
    setFile(file);
    setIsKoiLoading(true);
    setErrors([]); // Clear previous errors
    setData([]); // Clear previous data

    try {
      // Fetch koi data first
      const koiResponse = await getKoiQuery.refetch();
      const availableKoiItems = koiResponse.data?.data ?? [];
      setKoiItems(availableKoiItems);

      if (fileExtension === "csv") {
        Papa.parse<Record<string, string>>(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            // Process file data and get client validation results
            const { data: processedData, errors: clientErrors } =
              processFileData(results.data, fileExtension);

            // Set processed data
            setData(processedData);
            setIsKoiLoading(false);

            // Validate with server and combine errors
            await validateAuction(file, clientErrors);
          },
          error: (error) => {
            console.error("CSV parsing error", error);
            setErrors([{ row: -1, issues: ["Failed to parse CSV file."] }]);
            setIsKoiLoading(false);
          },
        });
      } else if (fileExtension === "xlsx") {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const data = e.target?.result as ArrayBuffer;
          const workbook = read(data);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Parse XLSX sheet into an array of objects
          const parsedRows = utils.sheet_to_json<Record<string, any>>(
            worksheet,
            {
              defval: "", // default empty value for empty cells
            },
          );

          // Normalize data
          parsedRows.forEach((row) => {
            Object.keys(row).forEach((key) => {
              if (row[key] === null || row[key] === undefined) {
                row[key] = "";
              } else {
                row[key] = String(row[key]);
              }

              if (key === "item") {
                row[key] = row[key].toString().trim();
              }
            });
          });

          // Process file data and get client validation results
          const { data: processedData, errors: clientErrors } = processFileData(
            parsedRows,
            fileExtension,
          );

          // Set processed data
          setData(processedData);
          setIsKoiLoading(false);

          // If no data was processed, reset and return early
          if (processedData.length === 0) {
            setFile(null);
            return;
          }

          // Validate with server and combine errors
          await validateAuction(file, clientErrors);
        };

        reader.onerror = () => {
          setErrors([{ row: -1, issues: ["Failed to read XLSX file."] }]);
          setIsKoiLoading(false);
        };

        reader.readAsArrayBuffer(file);
      } else {
        setErrors([
          {
            row: -1,
            issues: ["Unsupported file type. Please upload CSV or XLSX."],
          },
        ]);
        setData([]);
        setFile(null);
        setIsKoiLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch koi data", error);
      setErrors([{ row: -1, issues: ["Failed to fetch koi data."] }]);
      setIsKoiLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    setIsUploading(true);

    try {
      const response = await mutateAsync(file);
      console.log("Upload response", response);
      console.log("response error", response?.errors);
      console.log("Is there an error?", response?.errors?.length > 0);
      if (response?.errors.length > 0) {
        setErrors(response.errors);
      } else {
        console.log("Updating koi status...");
        console.log("data length", data.length);
        console.log("data", data);
        if (data.length > 0) {
          try {
            await Promise.all(
              data.map(
                (row) =>
                  new Promise<void>((resolve, reject) => {
                    updateKoiMutation.mutate(
                      { koiId: row.item, koiStatus: KoiStatus.IN_AUCTION },
                      {
                        onSuccess: () => resolve(),
                        onError: (error) => {
                          console.error(
                            `Failed to update status for koi ${row.item}`,
                            error,
                          );
                          reject(error);
                        },
                      },
                    );
                  }),
              ),
            );
          } catch (error) {
            console.error("Some koi status updates failed", error);
          }
        }
        toast.success("Auctions uploaded successfully!"); // 🎯

        reset();
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ row: -1, issues: ["An unknown error occurred."] }]);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    data,
    errors,
    isUploading: isUploading || isKoiLoading,
    isError,
    isPending,
    isSuccess,
    handleFileChange,
    handleUpload,
    reset,
    fileType,
  };
}
