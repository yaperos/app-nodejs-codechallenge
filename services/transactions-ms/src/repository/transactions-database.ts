import { numeric, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { transactionStatus, transactionType } from "../domain/transaction";

export const transactionTypePgEnum = pgEnum(
  "transaction_type_name_enum",
  transactionType
);
export const transactionStatusPgEnum = pgEnum(
  "transaction_status_name_enum",
  transactionStatus
);

export const transactionsTable = pgTable("transactions", {
  transactionExternalId: uuid("transaction_external_id").primaryKey(),
  transactionTypeName: transactionTypePgEnum("transaction_type_name").notNull(),
  transactionStatusName: transactionStatusPgEnum(
    "transaction_status_name"
  ).notNull(),
  value: numeric("value", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
