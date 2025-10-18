import type { Transaction, TransactionStatus, TransactionType } from "@prisma/client";

export const HIGH_VALUE_THRESHOLD = 1000;

export type TransactionRecord = Transaction & {
  status: TransactionStatus;
  type: TransactionType;
};
