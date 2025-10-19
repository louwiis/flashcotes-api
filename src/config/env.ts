// src/config/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.string().default("3000"),

  API_PREFIX: z.string().default("/api"),
  TRUST_PROXY: z.coerce.boolean().default(true),

  ENABLE_CORS: z.coerce.boolean().default(false),
  ENABLE_HELMET: z.coerce.boolean().default(true),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default("1 minute"),

  // DB / migrations
  DATABASE_URL: z.string().optional(), // Prisma will read it if present
  RUN_MIGRATIONS: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
