import { Test } from '@nestjs/testing';
import TransactionService from '../../../domain/services/transaction.service';
import { TRANSACTION_SERVICE } from '../../../commons/tokens';
import CreateTransactionInput from '../inputs/createTransaction.input';
import TransactionEntity from '../../../domain/entities/transaction.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import TransactionResolver from './transaction.resolve';
import { createMockTransactionEntity } from '../../../../../test/factories/transactionEntity.factory';
import { createMockTransactionInput } from '../../../../../test/factories/createTransactionInput.factory';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let transactionService: jest.Mocked<TransactionService>;
  let cacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const mockTransactionService = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        TransactionResolver,
        { provide: TRANSACTION_SERVICE, useValue: mockTransactionService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    resolver = module.get(TransactionResolver);
    transactionService = module.get(TRANSACTION_SERVICE);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('createTransaction', () => {
    it('should call transactionService.create and return the result', async () => {
      const input = createMockTransactionInput();
      const expectedTransaction = createMockTransactionEntity();

      transactionService.create.mockResolvedValue(expectedTransaction);

      const result = await resolver.createTransaction(input);

      expect(transactionService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(expectedTransaction);
    });
  });

  describe('getTransaction', () => {
    it('should call transactionService.findById and return the result', async () => {
      const transactionId = 'uuid-123';
      const expectedTransaction = createMockTransactionEntity();
      expectedTransaction.id = transactionId;

      transactionService.findById.mockResolvedValue(expectedTransaction);

      const result = await resolver.getTransaction(transactionId);

      expect(transactionService.findById).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(expectedTransaction);
    });

    it('should throw an error if service throws', async () => {
      const transactionId = 'uuid-err';
      transactionService.findById.mockRejectedValue(new Error('Service error'));

      await expect(resolver.getTransaction(transactionId)).rejects.toThrow('Service error');
    });
  });
});
