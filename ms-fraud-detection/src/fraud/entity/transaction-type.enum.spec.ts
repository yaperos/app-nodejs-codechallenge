import { TransactionType } from './transaction-type.enum';

describe('TransactionType', () => {
  it('should have DEBIT value', () => {
    expect(TransactionType.DEBIT).toBe('DEBIT');
  });

  it('should have CREDIT value', () => {
    expect(TransactionType.CREDIT).toBe('CREDIT');
  });

  it('should have all required enum values', () => {
    expect(Object.keys(TransactionType).length).toBe(2);
  });
});
