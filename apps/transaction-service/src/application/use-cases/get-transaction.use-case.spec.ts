import type { RedisService } from '@app/common';
import { Transaction } from '@domain/entities/transaction.entity';
import type { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { NotFoundException } from '@nestjs/common';
import { GetTransactionUseCase } from './get-transaction.use-case';

describe('GetTransactionUseCase', () => {
    let useCase: GetTransactionUseCase;
    let mockRepository: jest.Mocked<ITransactionRepository>;
    let mockRedisService: jest.Mocked<RedisService>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findByExternalId: jest.fn(),
            update: jest.fn(),
        } as jest.Mocked<ITransactionRepository>;

        mockRedisService = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            exists: jest.fn(),
            ttl: jest.fn(),
        } as unknown as jest.Mocked<RedisService>;

        useCase = new GetTransactionUseCase(mockRepository, mockRedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        const transactionId = '123e4567-e89b-12d3-a456-426614174000';
        const cacheKey = `transaction:${transactionId}`;

        const mockTransaction = new Transaction(
            transactionId,
            'debit-account-123',
            'credit-account-456',
            1,
            500,
            TransactionStatus.PENDING,
            new Date('2024-01-01T00:00:00Z'),
        );

        describe('cache hit scenarios', () => {
            it('should return transaction from cache when available', async () => {
                const cachedData = {
                    transactionExternalId: transactionId,
                    accountExternalIdDebit: 'debit-account-123',
                    accountExternalIdCredit: 'credit-account-456',
                    transferTypeId: 1,
                    value: 500,
                    transactionStatus: TransactionStatus.PENDING,
                    createdAt: '2024-01-01T00:00:00.000Z',
                };

                mockRedisService.get.mockResolvedValue(cachedData);

                const result = await useCase.execute(transactionId);

                expect(mockRedisService.get).toHaveBeenCalledWith(cacheKey);
                expect(mockRedisService.get).toHaveBeenCalledTimes(1);
                expect(mockRepository.findByExternalId).not.toHaveBeenCalled();
                expect(result.transactionExternalId).toBe(transactionId);
            });

            it('should re-hydrate Date object from cached string', async () => {
                const cachedData = {
                    transactionExternalId: transactionId,
                    accountExternalIdDebit: 'debit-account-123',
                    accountExternalIdCredit: 'credit-account-456',
                    transferTypeId: 1,
                    value: 500,
                    transactionStatus: TransactionStatus.PENDING,
                    createdAt: '2024-01-01T00:00:00.000Z',
                };

                mockRedisService.get.mockResolvedValue(cachedData);

                const result = await useCase.execute(transactionId);

                expect(result.createdAt).toBeInstanceOf(Date);
                expect(result.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
            });

            it('should not call repository when cache hit', async () => {
                const cachedData = {
                    transactionExternalId: transactionId,
                    accountExternalIdDebit: 'debit-account-123',
                    accountExternalIdCredit: 'credit-account-456',
                    transferTypeId: 1,
                    value: 500,
                    transactionStatus: TransactionStatus.PENDING,
                    createdAt: '2024-01-01T00:00:00.000Z',
                };

                mockRedisService.get.mockResolvedValue(cachedData);

                await useCase.execute(transactionId);

                expect(mockRepository.findByExternalId).not.toHaveBeenCalled();
            });
        });

        describe('cache miss scenarios', () => {
            it('should fetch from repository when cache misses', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId);

                expect(mockRedisService.get).toHaveBeenCalledWith(cacheKey);
                expect(mockRepository.findByExternalId).toHaveBeenCalledWith(transactionId);
                expect(result).toEqual(mockTransaction);
            });

            it('should cache transaction after fetching from repository', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId);

                expect(mockRedisService.set).toHaveBeenCalledWith(cacheKey, mockTransaction, 600);
            });

            it('should set 10 minutes (600 seconds) TTL when caching', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId);

                expect(mockRedisService.set).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 600);
            });

            it('should throw NotFoundException when transaction not found in repository', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(null);

                await expect(useCase.execute(transactionId)).rejects.toThrow(NotFoundException);
                await expect(useCase.execute(transactionId)).rejects.toThrow(
                    `Transaction with id ${transactionId} not found`,
                );
            });

            it('should not cache when transaction not found', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(null);

                await expect(useCase.execute(transactionId)).rejects.toThrow(NotFoundException);

                expect(mockRedisService.set).not.toHaveBeenCalled();
            });
        });

        describe('error handling', () => {
            it('should propagate Redis get errors', async () => {
                const redisError = new Error('Redis connection error');
                mockRedisService.get.mockRejectedValue(redisError);

                await expect(useCase.execute(transactionId)).rejects.toThrow('Redis connection error');
            });

            it('should propagate repository errors', async () => {
                mockRedisService.get.mockResolvedValue(null);
                const dbError = new Error('Database error');
                mockRepository.findByExternalId.mockRejectedValue(dbError);

                await expect(useCase.execute(transactionId)).rejects.toThrow('Database error');
            });

            it('should continue execution even if Redis set fails', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRedisService.set.mockRejectedValue(new Error('Redis set error'));

                await expect(useCase.execute(transactionId)).rejects.toThrow('Redis set error');
                expect(mockRepository.findByExternalId).toHaveBeenCalled();
            });
        });

        describe('cache key generation', () => {
            it('should use correct cache key format', async () => {
                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId);

                expect(mockRedisService.get).toHaveBeenCalledWith(`transaction:${transactionId}`);
            });

            it('should handle different transaction IDs', async () => {
                const differentId = '987e6543-e89b-12d3-a456-999999999999';
                const differentTransaction = new Transaction(
                    differentId,
                    'debit-account-999',
                    'credit-account-999',
                    2,
                    1000,
                    TransactionStatus.APPROVED,
                    new Date(),
                );

                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(differentTransaction);

                await useCase.execute(differentId);

                expect(mockRedisService.get).toHaveBeenCalledWith(`transaction:${differentId}`);
                expect(mockRedisService.set).toHaveBeenCalledWith(
                    `transaction:${differentId}`,
                    differentTransaction,
                    600,
                );
            });
        });

        describe('transaction status scenarios', () => {
            it('should cache and return APPROVED transaction', async () => {
                const approvedTransaction = new Transaction(
                    transactionId,
                    'debit-account-123',
                    'credit-account-456',
                    1,
                    500,
                    TransactionStatus.APPROVED,
                    new Date(),
                );

                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(approvedTransaction);

                const result = await useCase.execute(transactionId);

                expect(result.transactionStatus).toBe(TransactionStatus.APPROVED);
                expect(mockRedisService.set).toHaveBeenCalled();
            });

            it('should cache and return REJECTED transaction', async () => {
                const rejectedTransaction = new Transaction(
                    transactionId,
                    'debit-account-123',
                    'credit-account-456',
                    1,
                    500,
                    TransactionStatus.REJECTED,
                    new Date(),
                );

                mockRedisService.get.mockResolvedValue(null);
                mockRepository.findByExternalId.mockResolvedValue(rejectedTransaction);

                const result = await useCase.execute(transactionId);

                expect(result.transactionStatus).toBe(TransactionStatus.REJECTED);
                expect(mockRedisService.set).toHaveBeenCalled();
            });
        });
    });
});
