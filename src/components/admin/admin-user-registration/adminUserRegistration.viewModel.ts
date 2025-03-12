import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useCreateAdminUser from "@/server/user/createUser/mutation";
import { getErrorMessage } from "@/lib/handleApiError";

const adminUserFormSchema = z.object({
  username: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().nonempty(),
});

type AdminUserFormData = z.infer<typeof adminUserFormSchema>;

export const useCreateAdminUserDialog = (
  token: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const form = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserFormSchema),
  });

  const { mutateAsync: createAdminMutate, isPending: pendingCreate } =
    useCreateAdminUser(token, queryClient);

  const handleCreateAdminUser = async (data: AdminUserFormData) => {
    try {
      await createAdminMutate(data);
      toast.success("Admin user created successfully");
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    form,
    pendingCreate,
    handleCreateAdminUser,
  };
};
