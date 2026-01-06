import type { Config } from 'drizzle-kit';

export default {
    schema: [
        './apps/transaction-service/src/infrastructure/database/schema.ts',
        './apps/anti-fraud-service/src/infrastructure/database/fraud-rules.schema.ts',
    ],
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.TRANSACTION_DB_URL || process.env.ANTIFRAUD_DB_URL || '',
    },
} satisfies Config;
