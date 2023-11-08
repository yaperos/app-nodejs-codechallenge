import { TransactionType } from '../constants/transaction.const';
import { TransactionResponse } from '../interface/transaction.interface';
import { TransactionStatusResolver } from '../modules/transaction/transaction.schema';

export function transformTransaction(
  trx: TransactionResponse,
): TransactionStatusResolver {
  return {
    transactionExternalId: trx.id,
    transactionType: { name: TransactionType[trx.tranferTypeId] },
    transactionStatus: { name: trx.status },
    value: trx.value,
    createdAt: new Date(trx.createdAt),
  };
}
