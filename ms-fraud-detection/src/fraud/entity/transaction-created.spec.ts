import { TransactionCreated } from './transaction-created';
import { TransactionStatus } from './transaction-status.enum';

describe('TransactionCreated', () => {
  it('should be defined', () => {
    expect(
      new TransactionCreated('txn_123', 100.0, TransactionStatus.PENDING),
    ).toBeDefined();
  });
});
