import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateAuctionDraft from "@/server/auction/createAuctionToDraft/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  item: z.string().min(1, "Item is required"),
  reserve_price: z.number().min(1, "Reserve price must be greater than 0"),
  bid_increment: z.number().min(1, "Increment amount must be greater than 0"),
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
  },
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createAuction, isPending: pendingCreate } =
    useCreateAuctionDraft(token);

  const { mutate: updateAuction, isPending: pendingUpdate } = useUpdateAuction(
    token,
    queryClient,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      item: id,
      reserve_price: 0,
      bid_increment: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    if (operation === "create") {
      createAuction(
        {
          ...data,
          reserve_price: data.reserve_price,
          bid_increment: data.bid_increment,
        },
        {
          onSuccess: () => {
            toast.success("Auction created successfully");
            router.push("/dashboard/auctions");
          },
          onError: (error) => {
            toast.error(error.message);
            console.error("Failed to create auction:", error);
          },
        },
      );
    } else {
      updateAuction(
        {
          auctionId: id,
          data: {
            title: data.title,
            description: data.description,
            item: data.item,
            reserve_price: data.reserve_price.toString(),
            bid_increment: data.bid_increment.toString(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Auction updated successfully");
            router.push("/dashboard/auctions");
            queryClient.invalidateQueries({ queryKey: ["auction", id] });
          },
          onError: (error: Error) => {
            toast.error(error.message);
            console.error("Failed to update auction:", error);
          },
        },
      );
    }
  };

  return {
    form,
    onSubmit,
    pendingCreate,
    pendingUpdate,
    formatDate,
    formatCurrency,
    isUpdate: operation === "update",
  };
};

export default KoiAuctionFormViewModel;
