const validateTransaction = require('./transactionValidator');

describe('Transaction Validator', () => {
  it('should approve a transaction with amount less than 1000', async () => {
    const transaction = { amount: 500 };
    const result = await validateTransaction(transaction);
    expect(result.status).toBe('approved');
  });

  it('should reject a transaction with amount greater than 1000', async () => {
    const transaction = { amount: 1500 };
    const result = await validateTransaction(transaction);
    expect(result.status).toBe('rejected');
  });
});
