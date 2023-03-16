import { TransactionStatus } from "@infrastructure/enums";

export const transaction_status_recipe: Record<number, string> = {
  1: TransactionStatus.pending,
  2: TransactionStatus.approved,
  3: TransactionStatus.declined,
};
