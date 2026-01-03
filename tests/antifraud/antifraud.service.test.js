const { validateTransaction } = require('../../src/antifraud/antifraud.service');

describe('Anti-Fraud validation', () => {
  it('should approve transaction when amount <= 1000', () => {
    const transaction = { value: 500 };

    const result = validateTransaction(transaction);

    expect(result).toBe('approved');
  });

  it('should reject transaction when amount > 1000', () => {
    const transaction = { value: 1500 };

    const result = validateTransaction(transaction);

    expect(result).toBe('rejected');
  });
});
