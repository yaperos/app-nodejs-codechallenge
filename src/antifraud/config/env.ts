import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const envFile = process.env.ANTIFRAUD_ENV_FILE ?? ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  KAFKA_BROKERS: z
    .string()
    .min(1, "KAFKA_BROKERS is required")
    .transform((value) => value.split(",").map((broker) => broker.trim())),
  KAFKA_CLIENT_ID: z.string().min(1, "KAFKA_CLIENT_ID is required"),
  KAFKA_TRANSACTION_TOPIC: z
    .string()
    .min(1, "KAFKA_TRANSACTION_TOPIC is required"),
  KAFKA_STATUS_TOPIC: z
    .string()
    .min(1, "KAFKA_STATUS_TOPIC is required"),
  KAFKA_CONSUMER_GROUP_ANTIFRAUD: z
    .string()
    .min(1, "KAFKA_CONSUMER_GROUP_ANTIFRAUD is required")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid antifraud environment variables: ${formattedErrors}`);
}

export const env = parsed.data;
export type Env = typeof env;
