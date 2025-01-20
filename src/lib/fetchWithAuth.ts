import axios, { AxiosError, AxiosInstance } from "axios";
import { signOut } from "next-auth/react";

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export const fetchWithAuth: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

fetchWithAuth.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await signOut({ redirect: false });
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  },
);
