import { AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ApiErrorResponse | undefined;
    if (errorData?.message) {
      return errorData.message;
    }
  }

  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "An unexpected error occurred";
};
