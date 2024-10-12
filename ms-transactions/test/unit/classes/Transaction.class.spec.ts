import { Transaction } from "../../../src/classes/Transaction.class";

describe('Transaction', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = new Transaction('12345', 100);
  });

  it('should create a transaction with the given ID and value', () => {
    expect(transaction.getTransactionID()).toBe('12345');
    expect(transaction.getValue()).toBe(100);
  });

  it('should return the correct transaction ID', () => {
    expect(transaction.getTransactionID()).toBe('12345');
  });

  it('should return the correct value', () => {
    expect(transaction.getValue()).toBe(100);
  });
});
