import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCreateAuction } from "@/server/auction/createAuction/mutation";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  item: z.number().min(1, "Item is required"),
  start_datetime: z.date().min(new Date(), "Start date must be in the future"),
  end_datetime: z.date().min(new Date(), "End date must be in the future"),
  reserve_price: z.number().min(1, "Reserve price must be greater than 0"),
  bid_increment: z.number().min(1, "Increment amount must be greater than 0"),
});

const KoiAuctionFormViewModel = (token: string, koiID: string) => {
  const router = useRouter();
  const createAuctionMutation = useCreateAuction(token);
  const dateNow = new Date();
  const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      item: Number(koiID),
      start_datetime: dateNow,
      end_datetime: nextWeek,
      reserve_price: 0,
      bid_increment: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await createAuctionMutation.mutateAsync(data);
      toast.success("Auction created successfully");
      router.push("/admin/auctions");
    } catch (error) {
      toast.error("Failed to create auction");
      console.error("Failed to create auction:", error);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: createAuctionMutation.isPending,
    isError: createAuctionMutation.isError,
  };
};

export default KoiAuctionFormViewModel;
