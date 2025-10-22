import { TransactionEntity } from './transaction.entity';
import { TransactionStatus, TransactionType } from '../../../domain/entities/transaction.entity';

describe('TransactionEntity', () => {
  describe('convertAmountToNumber', () => {
    it('should convert string amount to number on insert/update', () => {
      const entity = new TransactionEntity();
      entity.amount = '150.50' as unknown as number;

      entity.convertAmountToNumber();

      expect(typeof entity.amount).toBe('number');
      expect(entity.amount).toBe(150.50);
    });

    it('should keep number amount as is', () => {
      const entity = new TransactionEntity();
      entity.amount = 200;

      entity.convertAmountToNumber();

      expect(entity.amount).toBe(200);
    });

    it('should handle zero amount', () => {
      const entity = new TransactionEntity();
      entity.amount = '0' as unknown as number;

      entity.convertAmountToNumber();

      expect(entity.amount).toBe(0);
    });

    it('should handle decimal string amounts', () => {
      const entity = new TransactionEntity();
      entity.amount = '99.99' as unknown as number;

      entity.convertAmountToNumber();

      expect(entity.amount).toBe(99.99);
    });

    it('should not throw when amount is undefined', () => {
      const entity = new TransactionEntity();

      expect(() => entity.convertAmountToNumber()).not.toThrow();
    });
  });

  describe('Entity Creation', () => {
    it('should create entity with required fields', () => {
      const entity = new TransactionEntity();
      entity.externalId = 'ext-123';
      entity.type = TransactionType.P2P;
      entity.amount = 100;
      entity.currency = 'PEN';
      entity.sourceAccountId = 'src-123';
      entity.targetAccountId = 'tgt-123';
      entity.status = TransactionStatus.PENDING;
      entity.metadata = {};
      entity.retryCount = 0;

      expect(entity.externalId).toBe('ext-123');
      expect(entity.type).toBe(TransactionType.P2P);
      expect(entity.amount).toBe(100);
      expect(entity.currency).toBe('PEN');
      expect(entity.sourceAccountId).toBe('src-123');
      expect(entity.targetAccountId).toBe('tgt-123');
      expect(entity.status).toBe(TransactionStatus.PENDING);
      expect(entity.retryCount).toBe(0);
    });

    it('should create entity with optional fields', () => {
      const entity = new TransactionEntity();
      entity.antifraudScore = 25;
      entity.antifraudStatus = 'APPROVED';
      entity.antifraudCheckedAt = new Date();
      entity.idempotencyKey = 'idem-123';
      entity.failureReason = 'Network error';
      entity.completedAt = new Date();
      entity.reversedAt = new Date();
      entity.reversalTransactionId = 'rev-123';

      expect(entity.antifraudScore).toBe(25);
      expect(entity.antifraudStatus).toBe('APPROVED');
      expect(entity.antifraudCheckedAt).toBeInstanceOf(Date);
      expect(entity.idempotencyKey).toBe('idem-123');
      expect(entity.failureReason).toBe('Network error');
      expect(entity.completedAt).toBeInstanceOf(Date);
      expect(entity.reversedAt).toBeInstanceOf(Date);
      expect(entity.reversalTransactionId).toBe('rev-123');
    });

    it('should handle metadata as object', () => {
      const entity = new TransactionEntity();
      entity.metadata = {
        key1: 'value1',
        key2: 123,
        key3: true,
      };

      expect(entity.metadata).toEqual({
        key1: 'value1',
        key2: 123,
        key3: true,
      });
    });

    it('should handle empty metadata', () => {
      const entity = new TransactionEntity();
      entity.metadata = {};

      expect(entity.metadata).toEqual({});
    });

    it('should allow null for optional fields', () => {
      const entity = new TransactionEntity();
      entity.antifraudScore = null;
      entity.antifraudStatus = null;
      entity.antifraudCheckedAt = null;
      entity.idempotencyKey = null;
      entity.failureReason = null;
      entity.completedAt = null;
      entity.reversedAt = null;
      entity.reversalTransactionId = null;

      expect(entity.antifraudScore).toBeNull();
      expect(entity.antifraudStatus).toBeNull();
      expect(entity.antifraudCheckedAt).toBeNull();
      expect(entity.idempotencyKey).toBeNull();
      expect(entity.failureReason).toBeNull();
      expect(entity.completedAt).toBeNull();
      expect(entity.reversedAt).toBeNull();
      expect(entity.reversalTransactionId).toBeNull();
    });
  });

  describe('Transaction Types', () => {
    it('should support P2P transaction type', () => {
      const entity = new TransactionEntity();
      entity.type = TransactionType.P2P;

      expect(entity.type).toBe(TransactionType.P2P);
    });

    it('should support PAYMENT transaction type', () => {
      const entity = new TransactionEntity();
      entity.type = TransactionType.PAYMENT;

      expect(entity.type).toBe(TransactionType.PAYMENT);
    });

    it('should support CASH_IN transaction type', () => {
      const entity = new TransactionEntity();
      entity.type = TransactionType.CASH_IN;

      expect(entity.type).toBe(TransactionType.CASH_IN);
    });

    it('should support CASH_OUT transaction type', () => {
      const entity = new TransactionEntity();
      entity.type = TransactionType.CASH_OUT;

      expect(entity.type).toBe(TransactionType.CASH_OUT);
    });
  });

  describe('Transaction Statuses', () => {
    it('should support PENDING status', () => {
      const entity = new TransactionEntity();
      entity.status = TransactionStatus.PENDING;

      expect(entity.status).toBe(TransactionStatus.PENDING);
    });

    it('should support COMPLETED status', () => {
      const entity = new TransactionEntity();
      entity.status = TransactionStatus.COMPLETED;

      expect(entity.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should support FAILED status', () => {
      const entity = new TransactionEntity();
      entity.status = TransactionStatus.FAILED;

      expect(entity.status).toBe(TransactionStatus.FAILED);
    });

    it('should support PROCESSING status', () => {
      const entity = new TransactionEntity();
      entity.status = TransactionStatus.PROCESSING;

      expect(entity.status).toBe(TransactionStatus.PROCESSING);
    });

    it('should support REVERSED status', () => {
      const entity = new TransactionEntity();
      entity.status = TransactionStatus.REVERSED;

      expect(entity.status).toBe(TransactionStatus.REVERSED);
    });
  });

  describe('Currency', () => {
    it('should support PEN currency', () => {
      const entity = new TransactionEntity();
      entity.currency = 'PEN';

      expect(entity.currency).toBe('PEN');
    });

    it('should support USD currency', () => {
      const entity = new TransactionEntity();
      entity.currency = 'USD';

      expect(entity.currency).toBe('USD');
    });

    it('should support other currencies', () => {
      const entity = new TransactionEntity();
      entity.currency = 'EUR';

      expect(entity.currency).toBe('EUR');
    });
  });
});
