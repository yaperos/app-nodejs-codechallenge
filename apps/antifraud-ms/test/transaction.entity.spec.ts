import { v4 } from 'uuid';
import { TransactionEntity } from '../src/domain/entities/transaction.entity';
import { TransactionStatusEnum } from '../src/domain/enums/transaction.enum';

describe('TransactionEntity', () => {
  it('transaction rejected', () => {
    const value = 1001;
    const transaction = TransactionEntity.create(v4(), value);
    expect(transaction.transactionStatus).toBe(TransactionStatusEnum.REJECTED);
  });

  it('transaction approved', () => {
    const value = 1000;
    const transaction = TransactionEntity.create(v4(), value);
    expect(transaction.transactionStatus).toBe(TransactionStatusEnum.APPROVED);
  });
});
