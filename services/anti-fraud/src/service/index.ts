import { MAX_TRANSACTION_VALUE, TransactionStatus } from "@my-org/common-tools";

export const evaluateTransaction = (value: number): number => {
  if (value > MAX_TRANSACTION_VALUE) {
    return TransactionStatus.Rejected;
  } else {
    return TransactionStatus.Approved;
  }
};
