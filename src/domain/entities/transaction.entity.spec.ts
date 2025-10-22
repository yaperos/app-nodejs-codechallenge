import { Transaction, TransactionType, TransactionStatus } from './transaction.entity';

describe('Transaction Entity', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = new Transaction({
      externalId: 'ext-123',
      type: TransactionType.P2P,
      amount: 100,
      currency: 'PEN',
      sourceAccountId: 'acc-source',
      targetAccountId: 'acc-target',
      status: TransactionStatus.PENDING,
      metadata: { description: 'Test transaction' },
      retryCount: 0,
    });
  });

  describe('Constructor', () => {
    it('should create a transaction with provided values', () => {
      expect(transaction.externalId).toBe('ext-123');
      expect(transaction.type).toBe(TransactionType.P2P);
      expect(transaction.amount).toBe(100);
      expect(transaction.currency).toBe('PEN');
      expect(transaction.sourceAccountId).toBe('acc-source');
      expect(transaction.targetAccountId).toBe('acc-target');
      expect(transaction.status).toBe(TransactionStatus.PENDING);
      expect(transaction.retryCount).toBe(0);
    });

    it('should generate UUID for id if not provided', () => {
      expect(transaction.id).toBeDefined();
      expect(transaction.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should set default values when not provided', () => {
      const minimalTransaction = new Transaction({});

      expect(minimalTransaction.type).toBe(TransactionType.P2P);
      expect(minimalTransaction.amount).toBe(0);
      expect(minimalTransaction.currency).toBe('PEN');
      expect(minimalTransaction.status).toBe(TransactionStatus.PENDING);
      expect(minimalTransaction.retryCount).toBe(0);
      expect(minimalTransaction.metadata).toEqual({});
    });

    it('should set createdAt and updatedAt timestamps', () => {
      expect(transaction.createdAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('canProcess', () => {
    it('should return true when status is PENDING', () => {
      transaction.status = TransactionStatus.PENDING;
      expect(transaction.canProcess()).toBe(true);
    });

    it('should return false when status is PROCESSING', () => {
      transaction.status = TransactionStatus.PROCESSING;
      expect(transaction.canProcess()).toBe(false);
    });

    it('should return false when status is COMPLETED', () => {
      transaction.status = TransactionStatus.COMPLETED;
      expect(transaction.canProcess()).toBe(false);
    });

    it('should return false when status is FAILED', () => {
      transaction.status = TransactionStatus.FAILED;
      expect(transaction.canProcess()).toBe(false);
    });
  });

  describe('markAsProcessing', () => {
    it('should change status to PROCESSING when in PENDING state', () => {
      transaction.status = TransactionStatus.PENDING;
      const beforeUpdate = transaction.updatedAt;

      transaction.markAsProcessing();

      expect(transaction.status).toBe(TransactionStatus.PROCESSING);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should throw error when not in PENDING state', () => {
      transaction.status = TransactionStatus.COMPLETED;

      expect(() => transaction.markAsProcessing()).toThrow(
        `Transaction ${transaction.id} cannot be processed in status ${TransactionStatus.COMPLETED}`
      );
    });
  });

  describe('markAsCompleted', () => {
    it('should change status to COMPLETED when in PROCESSING state', () => {
      transaction.status = TransactionStatus.PROCESSING;
      const beforeUpdate = transaction.updatedAt;

      transaction.markAsCompleted();

      expect(transaction.status).toBe(TransactionStatus.COMPLETED);
      expect(transaction.completedAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should throw error when not in PROCESSING state', () => {
      transaction.status = TransactionStatus.PENDING;

      expect(() => transaction.markAsCompleted()).toThrow(
        `Transaction ${transaction.id} must be in PROCESSING status to complete`
      );
    });
  });

  describe('markAsFailed', () => {
    it('should change status to FAILED with reason', () => {
      const reason = 'Network timeout';
      const beforeUpdate = transaction.updatedAt;

      transaction.markAsFailed(reason);

      expect(transaction.status).toBe(TransactionStatus.FAILED);
      expect(transaction.failureReason).toBe(reason);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should work from any status', () => {
      transaction.status = TransactionStatus.PROCESSING;
      transaction.markAsFailed('Processing error');
      expect(transaction.status).toBe(TransactionStatus.FAILED);

      const newTransaction = new Transaction({ status: TransactionStatus.PENDING });
      newTransaction.markAsFailed('Validation error');
      expect(newTransaction.status).toBe(TransactionStatus.FAILED);
    });
  });

  describe('markAsRejected', () => {
    it('should change status to REJECTED with reason', () => {
      const reason = 'Antifraud check failed';
      const beforeUpdate = transaction.updatedAt;

      transaction.markAsRejected(reason);

      expect(transaction.status).toBe(TransactionStatus.REJECTED);
      expect(transaction.failureReason).toBe(reason);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });
  });

  describe('canRetry', () => {
    it('should return true when status is FAILED, retryCount < 3, and not antifraud rejected', () => {
      transaction.status = TransactionStatus.FAILED;
      transaction.retryCount = 2;
      transaction.antifraudStatus = 'APPROVED';

      expect(transaction.canRetry()).toBe(true);
    });

    it('should return false when status is not FAILED', () => {
      transaction.status = TransactionStatus.PENDING;
      transaction.retryCount = 0;

      expect(transaction.canRetry()).toBe(false);
    });

    it('should return false when retryCount >= 3', () => {
      transaction.status = TransactionStatus.FAILED;
      transaction.retryCount = 3;

      expect(transaction.canRetry()).toBe(false);
    });

    it('should return false when antifraud rejected', () => {
      transaction.status = TransactionStatus.FAILED;
      transaction.retryCount = 1;
      transaction.antifraudStatus = 'REJECTED';

      expect(transaction.canRetry()).toBe(false);
    });
  });

  describe('incrementRetry', () => {
    it('should increment retry count', () => {
      const initialCount = transaction.retryCount;
      const beforeUpdate = transaction.updatedAt;

      transaction.incrementRetry();

      expect(transaction.retryCount).toBe(initialCount + 1);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should increment multiple times', () => {
      transaction.incrementRetry();
      transaction.incrementRetry();
      transaction.incrementRetry();

      expect(transaction.retryCount).toBe(3);
    });
  });

  describe('isAntifraudRejected', () => {
    it('should return true when antifraudStatus is REJECTED', () => {
      transaction.antifraudStatus = 'REJECTED';
      expect(transaction.isAntifraudRejected()).toBe(true);
    });

    it('should return false when antifraudStatus is APPROVED', () => {
      transaction.antifraudStatus = 'APPROVED';
      expect(transaction.isAntifraudRejected()).toBe(false);
    });

    it('should return false when antifraudStatus is undefined', () => {
      transaction.antifraudStatus = undefined;
      expect(transaction.isAntifraudRejected()).toBe(false);
    });
  });

  describe('setAntifraudResult', () => {
    it('should set antifraud score, status and timestamp', () => {
      const beforeUpdate = transaction.updatedAt;
      const score = 75;
      const status = 'APPROVED';

      transaction.setAntifraudResult(score, status);

      expect(transaction.antifraudScore).toBe(score);
      expect(transaction.antifraudStatus).toBe(status);
      expect(transaction.antifraudCheckedAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should handle rejected status', () => {
      transaction.setAntifraudResult(100, 'REJECTED');

      expect(transaction.antifraudScore).toBe(100);
      expect(transaction.antifraudStatus).toBe('REJECTED');
      expect(transaction.isAntifraudRejected()).toBe(true);
    });
  });

  describe('canReverse', () => {
    it('should return true when status is COMPLETED and not reversed', () => {
      transaction.status = TransactionStatus.COMPLETED;
      transaction.reversedAt = undefined;

      expect(transaction.canReverse()).toBe(true);
    });

    it('should return false when status is not COMPLETED', () => {
      transaction.status = TransactionStatus.PROCESSING;
      transaction.reversedAt = undefined;

      expect(transaction.canReverse()).toBe(false);
    });

    it('should return false when already reversed', () => {
      transaction.status = TransactionStatus.COMPLETED;
      transaction.reversedAt = new Date();

      expect(transaction.canReverse()).toBe(false);
    });
  });

  describe('markAsReversed', () => {
    it('should mark transaction as reversed when allowed', () => {
      transaction.status = TransactionStatus.COMPLETED;
      const reversalId = 'reversal-123';
      const beforeUpdate = transaction.updatedAt;

      transaction.markAsReversed(reversalId);

      expect(transaction.status).toBe(TransactionStatus.REVERSED);
      expect(transaction.reversalTransactionId).toBe(reversalId);
      expect(transaction.reversedAt).toBeInstanceOf(Date);
      expect(transaction.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should throw error when transaction cannot be reversed', () => {
      transaction.status = TransactionStatus.PENDING;

      expect(() => transaction.markAsReversed('reversal-123')).toThrow(
        `Transaction ${transaction.id} cannot be reversed`
      );
    });

    it('should throw error when already reversed', () => {
      transaction.status = TransactionStatus.COMPLETED;
      transaction.reversedAt = new Date();

      expect(() => transaction.markAsReversed('reversal-123')).toThrow(
        `Transaction ${transaction.id} cannot be reversed`
      );
    });
  });

  describe('Transaction Types', () => {
    it('should support P2P transactions', () => {
      const p2p = new Transaction({ type: TransactionType.P2P });
      expect(p2p.type).toBe(TransactionType.P2P);
    });

    it('should support PAYMENT transactions', () => {
      const payment = new Transaction({ type: TransactionType.PAYMENT });
      expect(payment.type).toBe(TransactionType.PAYMENT);
    });

    it('should support CASH_IN transactions', () => {
      const cashIn = new Transaction({ type: TransactionType.CASH_IN });
      expect(cashIn.type).toBe(TransactionType.CASH_IN);
    });

    it('should support CASH_OUT transactions', () => {
      const cashOut = new Transaction({ type: TransactionType.CASH_OUT });
      expect(cashOut.type).toBe(TransactionType.CASH_OUT);
    });
  });

  describe('Metadata handling', () => {
    it('should store string values in metadata', () => {
      transaction.metadata = { key: 'value' };
      expect(transaction.metadata.key).toBe('value');
    });

    it('should store number values in metadata', () => {
      transaction.metadata = { count: 42 };
      expect(transaction.metadata.count).toBe(42);
    });

    it('should store boolean values in metadata', () => {
      transaction.metadata = { isValid: true };
      expect(transaction.metadata.isValid).toBe(true);
    });

    it('should handle complex metadata', () => {
      transaction.metadata = {
        description: 'Test',
        userId: 123,
        verified: true,
      };

      expect(transaction.metadata.description).toBe('Test');
      expect(transaction.metadata.userId).toBe(123);
      expect(transaction.metadata.verified).toBe(true);
    });
  });
});
