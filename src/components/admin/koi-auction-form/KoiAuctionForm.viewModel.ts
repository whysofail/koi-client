import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAuctionDraft } from "@/server/auction/createAuctionToDraft/mutations";
import { toast } from "sonner";

const formSchema = z
  .object({
    title: z.string().nonempty("Title is required"),
    description: z.string().min(1, "Description is required"),
    item: z.string().min(1, "Item is required"),
    start_datetime: z.string().refine(
      (date) => {
        const now = new Date();
        const selectedDate = new Date(date);
        return selectedDate > now;
      },
      {
        message: "Start time must be in the future",
      },
    ),
    end_datetime: z.string().refine(
      (date) => {
        const now = new Date();
        const selectedDate = new Date(date);
        return selectedDate > now;
      },
      {
        message: "End time must be in the future",
      },
    ),
    reserve_price: z.number().min(1, "Reserve price must be greater than 0"),
    bid_increment: z.number().min(1, "Increment amount must be greater than 0"),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.start_datetime);
    const end = new Date(data.end_datetime);
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Auction duration must be at least 1 hour",
        path: ["end_datetime"],
      });
    }
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      item: koiID,
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

    try {
      const [hours, minutes] = timeString.split(":").map(Number);

      if (!isNaN(hours) && !isNaN(minutes)) {
        const timezoneOffset = new Date().getTimezoneOffset();

        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);

        const adjustedDate = new Date(
          newDate.getTime() - timezoneOffset * 60 * 1000,
        );
        onChange(adjustedDate.toISOString().split(".")[0]);
      } else {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        onChange(newDate.toISOString().split(".")[0]);
      }
    } catch (error) {
      console.error("Error updating datetime:", error);
    }
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
