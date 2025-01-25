import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAuction } from "@/server/auction/createAuction/mutations";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().min(1, "Description is required"),
  item: z.number().min(1, "Item is required"),
  start_datetime: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Start date must be in the future",
  }),
  end_datetime: z.string().refine((date) => new Date(date) > new Date(), {
    message: "End date must be in the future",
  }),
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
  const { mutate, isPending } = useCreateAuction(token);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      item: Number(koiID),
      start_datetime: "",
      end_datetime: "",
      reserve_price: 0,
      bid_increment: 0,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    mutate(
      {
        ...data,
        start_datetime: new Date(data.start_datetime),
        end_datetime: new Date(data.end_datetime),
      },
      {
        onSuccess: () => {
          toast.success("Auction created successfully");
        },
        onError: (error) => {
          toast.error("Failed to create auction");
          console.error("Failed to create auction:", error);
        },
      },
    );
  };

  const updateDateTime = (
    date: Date | undefined,
    timeString: string,
    onChange: (...event: any[]) => void,
  ) => {
    if (!date) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    onChange(newDate.toISOString().split(".")[0]);
  };

  return {
    form,
    onSubmit,
    isPending,
    formatDate,
    updateDateTime,
    formatCurrency,
  };
};

export default KoiAuctionFormViewModel;
