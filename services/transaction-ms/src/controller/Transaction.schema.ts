import { mixed, number, object, string } from "yup";
import {
  TransactionStatus,
  TransactionTransferType,
} from "../domain/Transaction";

export const TransactionGetSchema = object().shape({
  id: string().uuid().required(),
});

export const TransactionCreateSchema = object().shape({
  accountExternalIdDebit: string().uuid().required(),
  accountExternalIdCredit: string().uuid().required(),
  value: number().required(),
  transferTypeId: number<TransactionTransferType>()
    .oneOf(<number[]>Object.values(TransactionTransferType))
    .required(),
});

export const TransactionUpdateSchema = object().shape({
  transactionExternalId: string().uuid().required(),
  status: mixed<TransactionStatus>()
    .oneOf(Object.values(TransactionStatus))
    .required(),
});
