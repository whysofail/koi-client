import useGetUserByID from "@/server/user/getUserByID/queries";
import useBanUser from "@/server/user/banUser/mutations";
import useUnbanUser from "@/server/user/unbanUser/mutations";
import useWarnUser from "@/server/user/warnUser/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserDetailsViewModel = (
  userId: string,
  token: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetUserByID(userId, token);
  const banUserMutation = useBanUser(token, queryClient);
  const unbanUserMutation = useUnbanUser(token, queryClient);
  const warnUserMutation = useWarnUser(token, queryClient);

  const handleBanUser = () => {
    banUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success("User banned successfully");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        console.error("Failed to ban user:", error);
      },
    });
  };

  const handleUnbanUser = () => {
    unbanUserMutation.mutate(userId, {
      onSuccess: () => {
        toast.success("User unbanned successfully");
        onSuccess?.();
      },
      onError: () => {
        toast.error("Failed to unban user");
      },
    });
  };

  const handleWarnUser = (reason: string) => {
    warnUserMutation.mutate(
      { user_id: userId, reason },
      {
        onSuccess: () => {
          toast.success("User warned successfully");
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to warn user");
        },
      },
    );
  };

  return {
    user: data?.data,
    isLoading,
    error,
    handleBanUser,
    handleUnbanUser,
    handleWarnUser,
    isBanningUser: banUserMutation.isPending,
    isUnbanningUser: unbanUserMutation.isPending,
    isWarningUser: warnUserMutation.isPending,
  };
};
