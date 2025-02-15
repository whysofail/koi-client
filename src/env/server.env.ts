import { z } from "zod";

const serverEnvSchema = z.object({
  NEXTAUTH_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  KOI_HEADERS: z.string().min(1),
  APP_ENV: z.string().min(1),
  BACKEND_URL: z.string().min(1),
});

export const env = serverEnvSchema.parse(process.env);
