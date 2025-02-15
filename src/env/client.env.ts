import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
  NEXT_PUBLIC_APPLICATION_URL: z.string().min(1),
  NEXT_PUBLIC_SOCKET_URL: z.string().min(1),
  NEXT_PUBLIC_LARAVEL_URL: z.string().min(1),
});

export const env = clientEnvSchema.parse({
  NEXT_PUBLIC_APPLICATION_URL: process.env.NEXT_PUBLIC_APPLICATION_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NEXT_PUBLIC_LARAVEL_URL: process.env.NEXT_PUBLIC_LARAVEL_URL,
});
