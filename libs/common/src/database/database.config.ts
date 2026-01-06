import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export interface DatabaseConfig {
    url: string;
}

export const createDrizzleClient = (config: DatabaseConfig) => {
    const client = postgres(config.url, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
    });
    return drizzle(client);
};

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;
