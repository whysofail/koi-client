import useGetLoggedInUser from "@/server/user/getLoggedInUser/queries";

export const useUserProfileViewModel = (token: string) => {
  const { data, isLoading, error } = useGetLoggedInUser(token);

  return {
    user: data?.data,
    isLoading,
    error,
  };
};
