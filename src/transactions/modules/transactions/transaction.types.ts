import type { Transaction, TransactionStatus, TransactionType } from "@prisma/client";

export type TransactionRecord = Transaction & {
  status: TransactionStatus;
  type: TransactionType;
};
