import { Transaction } from '../entities/transaction.entity';
import { TransactionMessage } from '../entities/transaction.message';

export const ToMessageDto = (transaction: Transaction): TransactionMessage => ({
  id: transaction.id,
  accountExternalIdCredit: transaction.accountExternalIdCredit,
  accountExternalIdDebit: transaction.accountExternalIdDebit,
  tranferTypeId: transaction.tranferTypeId,
  value: transaction.value,
});
