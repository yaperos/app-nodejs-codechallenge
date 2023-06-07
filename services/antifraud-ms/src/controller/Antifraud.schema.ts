import { mixed, number, object, string } from "yup";
import { TransactionStatus } from "../domain/Antifraud";

export const verifyTransactionSchema = object().shape({
  transactionExternalId: string().uuid().required(),
  value: number().required(),
  status: mixed<TransactionStatus>()
    .oneOf([TransactionStatus.PENDING], "Transaction status must be PENDING")
    .required(),
});
