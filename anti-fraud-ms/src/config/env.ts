import { z } from 'zod';

export const envSchema = z.object({
    KAFKA_BROKERS: z.string().min(1).default('localhost:9092'),
    REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
    MAX_TRANSACTION_AMOUNT: z.coerce.number().positive().default(1000),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
    return envSchema.parse(raw);
}