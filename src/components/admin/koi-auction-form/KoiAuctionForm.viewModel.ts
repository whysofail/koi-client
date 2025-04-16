import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateAuctionDraft from "@/server/auction/createAuctionToDraft/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { KoiStatus, Koi } from "@/types/koiTypes";
import { getErrorMessage } from "@/lib/handleApiError";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { AuctionStatus } from "@/types/auctionTypes";
import { PaginatedResponse } from "@/types/koiTypes";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  rich_description: z
    .string({
      description: "Rich description must be a string",
    })
    .optional(),
  item: z.string().min(1, "Item is required"),
  buynow_price: z.number().min(1, "Buy now price must be greater than 0"),
  participation_fee: z
    .number()
    .min(1, "Participant fee must be greater than 0"),
  bid_increment: z
    .number()
    .min(1, "Bid increment amount must be greater than 0"),
  bid_starting_price: z
    .number({
      required_error: "Starting bid price is required",
    })
    .min(1, "Starting bid price must be greater than 0"),
  status: z.nativeEnum(AuctionStatus).optional(),
});

const formatDate = (date: Date | string) => {
  return format(new Date(date), "dd MMMM yyyy HH:mm");
};

const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const KoiAuctionFormViewModel = (
  token: string,
  id: string,
  operation: "create" | "update" | "republish",
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: createAuction, isPending: pendingCreate } =
    useCreateAuctionDraft(token);
  const {
    mutateAsync: updateAuction,
    isPending: pendingUpdate,
    isSuccess: successUpdate,
  } = useUpdateAuction(token, queryClient);
  const { mutateAsync: updateKoiStatus, isPending: pendingUpdateKoiStatus } =
    useUpdateKoi(queryClient);

  const { data, isLoading } = useGetAuctionByID(id, token, {
    enabled: operation === "update" || operation === "republish",
  });
  const auctionData = data?.data[0];

  // Initialize form with consistent default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rich_description: "", // Always initialize with empty string
      item: id,
      buynow_price: 0,
      participation_fee: 0,
      bid_increment: 0,
      bid_starting_price: 0,
      status: AuctionStatus.DRAFT as AuctionStatus,
    },
  });

  // Update form values when auction data is loaded
  useEffect(() => {
    if ((operation === "update" || operation === "republish") && auctionData) {
      form.reset({
        title: auctionData.title,
        description: auctionData.description,
        rich_description: auctionData.rich_description || "", // Ensure a default value if null
        participation_fee: parseFloat(auctionData.participation_fee),
        buynow_price: parseFloat(auctionData.buynow_price),
        bid_increment: parseFloat(auctionData.bid_increment),
        item: auctionData.item,
        status: auctionData.status as AuctionStatus,
        bid_starting_price: parseFloat(auctionData.bid_starting_price),
      });
    }
  }, [auctionData, operation, form]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    if (operation === "create") {
      try {
        await queryClient.cancelQueries({ queryKey: ["koiData"] });
        await queryClient.cancelQueries({ queryKey: ["allAuctions"] });

        const previousKoiData = queryClient.getQueryData<
          PaginatedResponse<Koi>
        >(["koiData"]);

        // Perform optimistic updates
        if (previousKoiData?.data) {
          queryClient.setQueryData<PaginatedResponse<Koi>>(
            ["koiData"],
            (old) => {
              if (!old?.data) return old ?? previousKoiData;
              return {
                ...old,
                data: old.data.map((koi) =>
                  koi.id === id
                    ? { ...koi, status: KoiStatus.IN_AUCTION }
                    : koi,
                ),
              };
            },
          );
        }

        try {
          // First update koi status with Promise wrapper
          const koiUpdateResult = await new Promise<boolean>(
            (resolve, reject) => {
              updateKoiStatus(
                {
                  koiId: id,
                  koiStatus: KoiStatus.IN_AUCTION,
                },
                {
                  onSuccess: () => resolve(true),
                  onError: reject,
                },
              );
            },
          );

          // Only proceed with auction creation if koi update succeeded
          if (koiUpdateResult) {
            await new Promise<void>((resolve, reject) => {
              createAuction(
                {
                  ...data,
                  buynow_price: data.buynow_price,
                  bid_increment: data.bid_increment,
                  rich_description: data.rich_description ?? "",
                },
                {
                  onSuccess: resolve,
                  onError: async (error) => {
                    // If auction creation fails, revert koi status first
                    await updateKoiStatus(
                      {
                        koiId: id,
                        koiStatus: KoiStatus.AUCTION,
                      },
                      {
                        onSettled: () => reject(error),
                      },
                    );
                  },
                },
              );
            });
          }

          toast.success("Auction created successfully");
          router.push("/dashboard/auctions");
        } catch (error) {
          queryClient.setQueryData(["koiData"], previousKoiData);
          throw error;
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
        console.error("Operation failed:", error);
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["koiData"] }),
          queryClient.invalidateQueries({ queryKey: ["allAuctions"] }),
        ]);
      }
    } else if (operation === "update") {
      // Update operation logic remains unchanged
      updateAuction(
        {
          auctionId: id,
          data: {
            title: data.title,
            description: data.description,
            rich_description: data.rich_description ?? "",
            item: data.item,
            buynow_price: data.buynow_price.toString(),
            participation_fee: data.participation_fee.toString(),
            bid_increment: data.bid_increment.toString(),
            status: data.status,
            bid_starting_price: data.bid_starting_price.toString(),
          },
        },
        {
          onSuccess: async () => {
            toast.success("Auction updated successfully");
            // Invalidate and refetch queries
            await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
            router.push("/dashboard/auctions");
          },
          onError: (error: Error) => {
            toast.error(error.message);
            console.error("Failed to update auction:", error);
          },
        },
      );
    } else if (operation === "republish") {
      try {
        await queryClient.cancelQueries({ queryKey: ["koiData"] });
        await queryClient.cancelQueries({ queryKey: ["allAuctions"] });

        const previousKoiData = queryClient.getQueryData<
          PaginatedResponse<Koi>
        >(["koiData"]);

        // Perform optimistic updates for koi data
        if (previousKoiData?.data) {
          queryClient.setQueryData<PaginatedResponse<Koi>>(
            ["koiData"],
            (old) => {
              if (!old?.data) return old ?? previousKoiData;
              return {
                ...old,
                data: old.data.map((koi) =>
                  koi.id === id
                    ? { ...koi, status: KoiStatus.IN_AUCTION }
                    : koi,
                ),
              };
            },
          );
        }

        try {
          await new Promise<void>((resolve, reject) => {
            // Here, we set the auction time and other necessary details
            updateAuction(
              {
                auctionId: id,
                data: {
                  title: data.title,
                  description: data.description,
                  rich_description: data.rich_description ?? "",
                  item: data.item,
                  buynow_price: data.buynow_price.toString(),
                  participation_fee: data.participation_fee.toString(),
                  bid_increment: data.bid_increment.toString(),
                  status: data.status,
                  bid_starting_price: data.bid_starting_price.toString(),
                },
              },
              {
                onSuccess: resolve,
                onError: async (error) => {
                  // If auction republish fails, revert koi status first
                  await updateKoiStatus(
                    {
                      koiId: id,
                      koiStatus: KoiStatus.AUCTION,
                    },
                    {
                      onSettled: () => reject(error),
                    },
                  );
                },
              },
            );
          });

          toast.success("Auction updated successfully");
        } catch (error) {
          queryClient.setQueryData(["koiData"], previousKoiData);
          throw error;
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
        console.error("Republish failed:", error);
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["koiData"] }),
          queryClient.invalidateQueries({ queryKey: ["allAuctions"] }),
        ]);
      }
    }
  };

  const isSubmitting =
    operation === "create"
      ? pendingCreate || pendingUpdateKoiStatus
      : pendingUpdate;

  return {
    form,
    onSubmit,
    pendingCreate: isSubmitting,
    pendingUpdate,
    formatDate,
    formatCurrency,
    isUpdate: operation === "update",
    isLoading,
    successUpdate,
  };
};

export default KoiAuctionFormViewModel;
