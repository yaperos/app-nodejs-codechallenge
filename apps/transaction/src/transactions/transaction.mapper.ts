import { TransactionResponseDto } from './dto/transaction-response.dto';
import { Transaction } from './entities/transaction.entity';

export function toTransactionResponse(
  transaction: Transaction,
): TransactionResponseDto {
  return {
    transactionExternalId: transaction.transactionExternalId,
    transactionType: { name: transaction.transferType.name },
    transactionStatus: { name: transaction.status },
    value: Number(transaction.value),
    createdAt: transaction.createdAt.toISOString(),
  };
}
