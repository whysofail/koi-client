import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_AUTH_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  BACKEND_URL: z.string().min(1),
});

export const env = serverEnvSchema.parse(process.env);
