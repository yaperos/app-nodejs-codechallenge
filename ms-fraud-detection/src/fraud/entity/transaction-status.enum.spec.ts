import { TransactionStatus } from './transaction-status.enum';

describe('TransactionStatus', () => {
  it('should have PENDING status', () => {
    expect(TransactionStatus.PENDING).toBe('PENDING');
  });

  it('should have APPROVED status', () => {
    expect(TransactionStatus.APPROVED).toBe('APPROVED');
  });

  it('should have REJECTED status', () => {
    expect(TransactionStatus.REJECTED).toBe('REJECTED');
  });

  it('should have all required enum values', () => {
    expect(Object.keys(TransactionStatus).length).toBe(3);
  });
});
