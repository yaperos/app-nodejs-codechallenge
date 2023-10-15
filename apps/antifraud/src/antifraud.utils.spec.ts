import { getTransactionStatus } from './utils';

describe('AntifraudController', () => {
  describe('root', () => {
    it('should return "rejected"', async () => {
      const result = await getTransactionStatus(29999999);
      expect(result).toBe('rejected');
    });

    it('should return "success"', async () => {
      const result = await getTransactionStatus(999);
      expect(result).toBe('success');
    });
  });
});
