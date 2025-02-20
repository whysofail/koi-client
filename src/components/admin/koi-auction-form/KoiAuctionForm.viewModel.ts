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
import { KoiStatus } from "@/types/koiTypes";
import { getErrorMessage } from "@/lib/handleApiError";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { AuctionStatus } from "@/types/auctionTypes";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  item: z.string().min(1, "Item is required"),
  reserve_price: z.number().min(1, "Reserve price must be greater than 0"),
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
  initialData?: {
    title: string;
    description: string;
    item: string;
    reserve_price: number;
    bid_increment: number;
    status: AuctionStatus;
  },
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
      item: operation === "update" && auctionData ? auctionData.item : id,
      reserve_price: 0,
      bid_increment: 0,
      status: AuctionStatus.DRAFT as AuctionStatus,
      ...(operation === "update" && auctionData
        ? {
            title: auctionData.title,
            description: auctionData.description,
            reserve_price: parseFloat(auctionData.reserve_price),
            bid_increment: parseFloat(auctionData.bid_increment),
            status: auctionData.status as AuctionStatus,
          }
        : initialData),
    },
  });

  useEffect(() => {
    if (operation === "update" && auctionData) {
      form.reset({
        title: auctionData.title,
        description: auctionData.description,
        reserve_price: parseFloat(auctionData.reserve_price),
        bid_increment: parseFloat(auctionData.bid_increment),
        item: auctionData.item, // Fix here, previously id (auction ID) was incorrectly assigned
        status: auctionData.status as AuctionStatus,
      });
    }
  }, [auctionData, operation, form]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    if (operation === "create") {
      try {
        await new Promise((resolve, reject) => {
          updateKoiStatus(
            {
              koiId: id,
              koiStatus: KoiStatus.IN_AUCTION,
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        });

        await new Promise((resolve, reject) => {
          createAuction(
            {
              ...data,
              reserve_price: data.reserve_price,
              bid_increment: data.bid_increment,
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        });

        toast.success("Auction created successfully");
        queryClient.invalidateQueries({ queryKey: ["koiData", id] });
        queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
        router.push("/dashboard/auctions");
      } catch (error) {
        toast.error(getErrorMessage(error));
        console.error("Operation failed:", error);
      }
    } else if (operation === "update") {
      updateAuction(
        {
          auctionId: id,
          data: {
            title: data.title,
            description: data.description,
            item: data.item,
            reserve_price: data.reserve_price.toString(),
            bid_increment: data.bid_increment.toString(),
            status: data.status,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
            toast.success("Auction updated successfully");
            router.push("/dashboard/auctions");
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
