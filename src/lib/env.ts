import { z } from "zod";

const env_schema = z.object({
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  JWT_SECRET: z.string().min(32, "JWT Secret must be at least 32 characters long"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed_env = env_schema.safeParse(process.env);

if (!parsed_env.success) {
  console.error("❌ Invalid environment variables:", parsed_env.error.flatten().fieldErrors);
  throw new Error("Critical: Missing environment variables.");
}

export const env = parsed_env.data;