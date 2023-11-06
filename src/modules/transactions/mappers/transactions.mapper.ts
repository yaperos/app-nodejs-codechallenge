import { TransactionsEntity } from '@entities/transactions.entity';
import {
  CreateTransactionDto,
  TransactionDto,
  TransactionEntityDto,
} from '../transactions.dto';
import { TRANSACTION_STATUS } from '@config/transaction-status.enum';

export const mapTransactionToEntity = (
  dataForCreateTransaction: CreateTransactionDto,
): TransactionEntityDto => {
  const firstTransactionStatus =
    dataForCreateTransaction.value > 1000
      ? TRANSACTION_STATUS.REJECTED
      : TRANSACTION_STATUS.PENDING;

  return {
    transaction_external_id: dataForCreateTransaction.transactionExternalId,
    transaction_type_id: dataForCreateTransaction.tranferTypeId,
    transaction_type_name: dataForCreateTransaction.tranferTypeName || '',
    transaction_status: firstTransactionStatus,
    value: dataForCreateTransaction.value,
  };
};

export const mapTransactionToResponse = (
  transactionSaved: TransactionsEntity,
): TransactionDto => {
  return {
    transactionExternalId: transactionSaved.transaction_external_id,
    transactionType: {
      id: transactionSaved.transaction_type_id,
      name: transactionSaved.transaction_type_name,
    },
    transactionStatus: { name: transactionSaved.transaction_status },
    value: transactionSaved.value,
    createdAt: transactionSaved.created_at,
    updatedAt: transactionSaved.updated_at,
  };
};
