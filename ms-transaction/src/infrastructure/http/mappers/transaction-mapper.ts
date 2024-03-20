import type { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { TransactionDto } from '../dtos/transaction.dto';

export class TransactionsMapper {
  private constructor() {
    throw new Error(
      'TransactionsMapper is a static class and should not be instantiated',
    );
  }

  public static toDto(transaction: TransactionEntity): TransactionDto {
    return {
      externalId: transaction.externalId,
      amount: transaction.amount,
      transferTypeName: transaction.transferTypeName,
      status: transaction.status,
      createdAt: transaction.createdAt,
    };
  }
}
