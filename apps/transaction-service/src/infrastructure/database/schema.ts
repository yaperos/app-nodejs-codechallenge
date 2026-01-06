import { decimal, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    transactionExternalId: uuid('transaction_external_id').notNull().unique(),
    accountExternalIdDebit: uuid('account_external_id_debit').notNull(),
    accountExternalIdCredit: uuid('account_external_id_credit').notNull(),
    transferTypeId: integer('transfer_type_id').notNull(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),
    transactionStatus: varchar('transaction_status', { length: 20 }).notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type TransactionSchema = typeof transactions.$inferSelect;
export type NewTransactionSchema = typeof transactions.$inferInsert;
