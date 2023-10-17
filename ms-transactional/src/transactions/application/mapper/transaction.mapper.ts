import { TransactionDto } from 'src/transactions/domain/dto/transaction.dto';
import { Transaction } from 'src/transactions/domain/entity/transaction';

export abstract class TransactionMapper {
  public static toDto(transaction: Transaction): TransactionDto {
    return TransactionDto.builder()
      .transactionExternalId(transaction.transactionId)
      .transactionType({ name: transaction.transferType })
      .transactionStatus({ name: transaction.status })
      .value(transaction.amount)
      .createdAt(transaction.createdAt)
      .build();
  }
}
