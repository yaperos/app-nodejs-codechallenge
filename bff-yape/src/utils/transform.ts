import { TransactionType } from 'src/constants/transaction.const';
import { TransactionResponse } from 'src/interface/transaction.interface';
import { TransactionStatusResolver } from 'src/modules/transaction/transaction.schema';

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
