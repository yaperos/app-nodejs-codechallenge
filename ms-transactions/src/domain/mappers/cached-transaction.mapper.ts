import Decimal from 'decimal.js';
import { Transaction } from '../entities/transaction';
import { CachedTransactionDTO } from '../dto/cached-transaction.dto';

export class CachedTransactionMapper {
  static toDTO(transaction: Transaction): CachedTransactionDTO {
    return {
      id: transaction.id,
      accountDebit: transaction.accountDebit,
      accountCredit: transaction.accountCredit,
      transferType: transaction.transferType,
      status: transaction.status,
      value: transaction.value.toString(),
      createdAt: transaction.createdAt.toISOString(),
    };
  }

  static fromDTO(dto: CachedTransactionDTO): Transaction {
    const transaction = new Transaction();
    transaction.id = dto.id;
    transaction.accountDebit = dto.accountDebit;
    transaction.accountCredit = dto.accountCredit;
    transaction.transferType = dto.transferType;
    transaction.status = dto.status;
    transaction.value = new Decimal(dto.value);
    transaction.createdAt = new Date(dto.createdAt);
    return transaction;
  }
}
