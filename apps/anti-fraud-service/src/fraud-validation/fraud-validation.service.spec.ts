import { Test, TestingModule } from '@nestjs/testing';
import {
  FraudValidationService,
  TransactionCreatedEvent,
  TransactionValidationStatus,
} from './fraud-validation.service';

describe('FraudValidationService', () => {
  let service: FraudValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FraudValidationService],
    }).compile();

    service = module.get<FraudValidationService>(FraudValidationService);
  });

  describe('validate', () => {
    const createMockTransaction = (value: number): TransactionCreatedEvent => ({
      transactionExternalId: '550e8400-e29b-41d4-a716-446655440000',
      accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440001',
      accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440002',
      tranferTypeId: 1,
      value,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    describe('should APPROVE transactions with value <= 1000', () => {
      it('should approve transaction with value = 0', () => {
        const transaction = createMockTransaction(0);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.APPROVED,
        });
      });

      it('should approve transaction with value = 1', () => {
        const transaction = createMockTransaction(1);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.APPROVED,
        });
      });

      it('should approve transaction with value = 500', () => {
        const transaction = createMockTransaction(500);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.APPROVED,
        });
      });

      it('should approve transaction with value = 999', () => {
        const transaction = createMockTransaction(999);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.APPROVED,
        });
      });

      it('should approve transaction with value = 1000 (edge case)', () => {
        const transaction = createMockTransaction(1000);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.APPROVED,
        });
      });
    });

    describe('should REJECT transactions with value > 1000', () => {
      it('should reject transaction with value = 1001 (edge case)', () => {
        const transaction = createMockTransaction(1001);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.REJECTED,
        });
      });

      it('should reject transaction with value = 1500', () => {
        const transaction = createMockTransaction(1500);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.REJECTED,
        });
      });

      it('should reject transaction with value = 10000', () => {
        const transaction = createMockTransaction(10000);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.REJECTED,
        });
      });

      it('should reject transaction with very large value', () => {
        const transaction = createMockTransaction(1000000);
        const result = service.validate(transaction);

        expect(result).toEqual({
          transactionExternalId: transaction.transactionExternalId,
          status: TransactionValidationStatus.REJECTED,
        });
      });
    });

    describe('should handle decimal values', () => {
      it('should approve transaction with value = 1000.00', () => {
        const transaction = createMockTransaction(1000.0);
        const result = service.validate(transaction);

        expect(result.status).toBe(TransactionValidationStatus.APPROVED);
      });

      it('should reject transaction with value = 1000.01', () => {
        const transaction = createMockTransaction(1000.01);
        const result = service.validate(transaction);

        expect(result.status).toBe(TransactionValidationStatus.REJECTED);
      });

      it('should approve transaction with value = 999.99', () => {
        const transaction = createMockTransaction(999.99);
        const result = service.validate(transaction);

        expect(result.status).toBe(TransactionValidationStatus.APPROVED);
      });
    });

    describe('should preserve transactionExternalId', () => {
      it('should return the same transactionExternalId in the result', () => {
        const customId = 'custom-uuid-12345';
        const transaction: TransactionCreatedEvent = {
          transactionExternalId: customId,
          accountExternalIdDebit: '550e8400-e29b-41d4-a716-446655440001',
          accountExternalIdCredit: '550e8400-e29b-41d4-a716-446655440002',
          tranferTypeId: 1,
          value: 500,
          createdAt: new Date(),
        };

        const result = service.validate(transaction);

        expect(result.transactionExternalId).toBe(customId);
      });
    });
  });
});
