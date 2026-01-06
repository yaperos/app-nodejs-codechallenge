import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const createDrizzleClient = (connectionString: string) => {
    const client = postgres(connectionString);
    return drizzle(client, { schema });
};

export type DrizzleClient = ReturnType<typeof createDrizzleClient>;
