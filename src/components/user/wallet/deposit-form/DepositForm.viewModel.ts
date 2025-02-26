import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateDeposit } from "@/server/wallet/deposit/mutation";
import { getErrorMessage } from "@/lib/handleApiError";
import { useRouter } from "next/navigation";

// Define schema with nullable File
const formSchema = z.object({
  amount: z.string().nonempty("Amount is required"),
  proofOfPayment: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, {
      message: "Proof of payment is required",
    }),
});

type DepositFormInputs = {
  amount: string;
  proofOfPayment: File | null;
};

const useDepositFormViewModel = (
  token: string,
  initialData?: DepositFormInputs,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: createDeposit, isPending: pendingCreate } =
    useCreateDeposit(token, queryClient);

  const form = useForm<DepositFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      proofOfPayment: null,
      ...initialData,
    },
  });

  const onSubmit: SubmitHandler<DepositFormInputs> = async (data) => {
    if (!data.proofOfPayment) {
      toast.error("Please upload proof of payment");
      return;
    }

    try {
      await createDeposit(
        {
          data: {
            amount: data.amount,
            proof_of_payment: data.proofOfPayment,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Deposit request submitted successfully");
            router.push("/dashboard/transactions");
          },
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    form,
    onSubmit,
    pendingCreate,
  };
};

export default useDepositFormViewModel;
