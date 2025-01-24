import axios, { AxiosError, AxiosInstance } from "axios";

export const fetchWithAuth: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_BACKEND_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

fetchWithAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  },
);
