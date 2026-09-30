import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1),
    KAFKA_BROKERS: z.string().min(1).default('localhost:9092'),
    REDIS_URL: z.string().min(1).default('redis://localhost:6379'),
    OUTBOX_POLL_INTERVAL_MS: z.coerce.number().default(1000),
    OUTBOX_BATCH_SIZE: z.coerce.number().default(100),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
    return envSchema.parse(raw);
}