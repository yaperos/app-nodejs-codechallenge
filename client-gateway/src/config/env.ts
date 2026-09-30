import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.coerce.number().default(8080),
    TRANSACTION_SERVICE_URL: z.string().url().default('http://localhost:3000'),
    UPSTREAM_TIMEOUT_MS: z.coerce.number().int().positive().default(3000),
    RATE_LIMIT_TTL_MS: z.coerce.number().int().positive().default(60_000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    API_KEYS: z.string().default(''),
    CORS_ORIGINS: z.string().default(''),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
    return envSchema.parse(raw);
}