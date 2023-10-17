import { getTransactionStatus } from './utils';

describe('AntifraudController', () => {
  describe('root', () => {
    it('should return "rejected"', async () => {
      process.env.TRANSACTION_REJECTED_STATUS = 'rejected';
      const result = await getTransactionStatus(29999999);
      expect(result).toBe('rejected');
    });

    it('should return "success"', async () => {
      process.env.TRANSACTION_SUCCESS_STATUS = 'success';
      const result = await getTransactionStatus(999);
      expect(result).toBe('success');
    });
  });
});
