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

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  rich_description: z
    .string({
      required_error: "Description is required",
    })
    .min(1, "Description is required"),
  item: z.string().min(1, "Item is required"),
  reserve_price: z.number().min(1, "Reserve price must be greater than 0"),
  participation_fee: z.number().min(1, "Reserve price must be greater than 0"),
  bid_increment: z.number().min(1, "Increment amount must be greater than 0"),
  status: z.nativeEnum(AuctionStatus).optional(),
});

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const KoiAuctionFormViewModel = (
  token: string,
  id: string,
  operation: "create" | "update",
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: createAuction, isPending: pendingCreate } =
    useCreateAuctionDraft(token);
  const { mutateAsync: updateAuction, isPending: pendingUpdate } =
    useUpdateAuction(token, queryClient);
  const { mutateAsync: updateKoiStatus, isPending: pendingUpdateKoiStatus } =
    useUpdateKoi(queryClient);

  const { data } = useGetAuctionByID(id, token, {
    enabled: operation === "update",
  });
  const auctionData = data?.data[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      rich_description:
        operation === "update" ? auctionData?.rich_description : "",
      item: operation === "update" ? auctionData?.item : id,
      reserve_price: 0,
      participation_fee: 0,
      bid_increment: 0,
      status: AuctionStatus.DRAFT as AuctionStatus,
    },
  });

  useEffect(() => {
    if (operation === "update" && auctionData) {
      form.reset({
        title: auctionData.title,
        description: auctionData.description,
        rich_description: auctionData.rich_description,
        participation_fee: parseFloat(auctionData.participation_fee),
        reserve_price: parseFloat(auctionData.reserve_price),
        bid_increment: parseFloat(auctionData.bid_increment),
        item: auctionData.item,
        status: auctionData.status as AuctionStatus,
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
                  reserve_price: data.reserve_price,
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
      updateAuction(
        {
          auctionId: id,
          data: {
            title: data.title,
            description: data.description,
            rich_description: data.rich_description ?? "",
            item: data.item,
            reserve_price: data.reserve_price.toString(),
            participation_fee: data.participation_fee.toString(),
            bid_increment: data.bid_increment.toString(),
            status: data.status,
          },
        },
        {
          onSuccess: () => {
            toast.success("Auction updated successfully");
            router.push("/dashboard/auctions");
            queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
          },
          onError: (error: Error) => {
            toast.error(error.message);
            console.error("Failed to update auction:", error);
          },
        },
      );
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
  };
};

export default KoiAuctionFormViewModel;
