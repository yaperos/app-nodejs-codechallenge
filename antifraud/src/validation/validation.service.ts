import { Injectable } from '@nestjs/common';
// import { Transaction } from '@transactons/entities/transaction.entity';
import { FinancialTransaction } from '@transactions/transactions/entities/financial-transaction.entity';

@Injectable()
export class ValidationService {
  validate(transaction: FinancialTransaction): FinancialTransaction {
    return {
      ...transaction,
      transactionStatus: transaction.value > 1000 ? 'rejected' : 'approved',
      transactionExternalId: crypto.randomUUID(),
    };
  }
}
