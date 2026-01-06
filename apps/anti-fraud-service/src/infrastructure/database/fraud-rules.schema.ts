import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const fraudRules = pgTable('fraud_rules', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    ruleType: varchar('rule_type', { length: 50 }).notNull(),
    condition: jsonb('condition').notNull(),
    action: varchar('action', { length: 20 }).notNull().default('REJECT'),
    priority: integer('priority').notNull().default(100),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const fraudRuleExecutions = pgTable('fraud_rule_executions', {
    id: uuid('id').primaryKey().defaultRandom(),
    ruleId: uuid('rule_id')
        .notNull()
        .references(() => fraudRules.id),
    transactionExternalId: uuid('transaction_external_id').notNull(),
    matched: boolean('matched').notNull(),
    action: varchar('action', { length: 20 }).notNull(),
    details: jsonb('details'),
    executedAt: timestamp('executed_at').notNull().defaultNow(),
});

export type FraudRule = typeof fraudRules.$inferSelect;
export type NewFraudRule = typeof fraudRules.$inferInsert;
export type FraudRuleExecution = typeof fraudRuleExecutions.$inferSelect;
export type NewFraudRuleExecution = typeof fraudRuleExecutions.$inferInsert;
