import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import useCreateAuctionDraft from "@/server/auction/createAuctionToDraft/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

const KoiAuctionFormViewModel = (token: string, koiID: string) => {
  const { mutate, isPending } = useCreateAuctionDraft(token);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      item: koiID,
      reserve_price: 0,
      bid_increment: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Auction created successfully");
          router.push("/auctions");
        },
        onError: (error) => {
          toast.error("Failed to create auction");
          console.error("Failed to create auction:", error);
        },
      },
    );
  };

  return {
    form,
    onSubmit,
    isPending,
    formatDate,
    formatCurrency,
  };
};

export default KoiAuctionFormViewModel;
