import { TransactionsEntity } from '@entities/transactions.entity';
import {
  CreateTransactionDto,
  TransactionDto,
  TransactionEntityDto,
} from '../transactions.dto';

export const mapTransactionToEntity = (
  dataForCreateTransaction: CreateTransactionDto,
): TransactionEntityDto => {
  return {
    transaction_external_id: dataForCreateTransaction.transactionExternalId,
    transaction_type_id: dataForCreateTransaction.tranferTypeId,
    transaction_type_name: dataForCreateTransaction.tranferTypeName || '',
    transaction_status: 'PENDING',
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
