import type { RedisService } from '@app/common';
import type { LoggerService } from '@app/observability';
import { Transaction } from '@domain/entities/transaction.entity';
import type { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { NotFoundException } from '@nestjs/common';
import { UpdateTransactionStatusUseCase } from './update-transaction-status.use-case';

describe('UpdateTransactionStatusUseCase', () => {
    let useCase: UpdateTransactionStatusUseCase;
    let mockRepository: jest.Mocked<ITransactionRepository>;
    let mockLogger: jest.Mocked<LoggerService>;
    let mockRedisService: jest.Mocked<RedisService>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findByExternalId: jest.fn(),
            update: jest.fn(),
        } as jest.Mocked<ITransactionRepository>;

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;

        mockRedisService = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            exists: jest.fn(),
            ttl: jest.fn(),
        } as unknown as jest.Mocked<RedisService>;

        useCase = new UpdateTransactionStatusUseCase(mockRepository, mockLogger, mockRedisService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        const transactionId = '123e4567-e89b-12d3-a456-426614174000';
        const cacheKey = `transaction:${transactionId}`;

        let mockTransaction: Transaction;

        beforeEach(() => {
            mockTransaction = new Transaction(
                transactionId,
                'debit-account-123',
                'credit-account-456',
                1,
                500,
                TransactionStatus.PENDING,
                new Date('2024-01-01T00:00:00Z'),
            );
        });

        describe('successful status updates', () => {
            it('should update transaction status to APPROVED', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(result.transactionStatus).toBe(TransactionStatus.APPROVED);
                expect(mockRepository.update).toHaveBeenCalledWith(mockTransaction);
            });

            it('should update transaction status to REJECTED', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.REJECTED);

                expect(result.transactionStatus).toBe(TransactionStatus.REJECTED);
                expect(mockRepository.update).toHaveBeenCalledWith(mockTransaction);
            });

            it('should call approve() method when status is APPROVED', async () => {
                const approveSpy = jest.spyOn(mockTransaction, 'approve');
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(approveSpy).toHaveBeenCalledTimes(1);
            });

            it('should call reject() method when status is REJECTED', async () => {
                const rejectSpy = jest.spyOn(mockTransaction, 'reject');
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.REJECTED);

                expect(rejectSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe('repository interactions', () => {
            it('should fetch transaction by external ID', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockRepository.findByExternalId).toHaveBeenCalledWith(transactionId);
                expect(mockRepository.findByExternalId).toHaveBeenCalledTimes(1);
            });

            it('should throw NotFoundException when transaction not found', async () => {
                mockRepository.findByExternalId.mockResolvedValue(null);

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow(
                    NotFoundException,
                );
                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow(
                    `Transaction with id ${transactionId} not found`,
                );
            });

            it('should not update repository when transaction not found', async () => {
                mockRepository.findByExternalId.mockResolvedValue(null);

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow();

                expect(mockRepository.update).not.toHaveBeenCalled();
            });

            it('should update transaction in repository', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockRepository.update).toHaveBeenCalledWith(mockTransaction);
                expect(mockRepository.update).toHaveBeenCalledTimes(1);
            });
        });

        describe('cache updates', () => {
            it('should update cache after successful status update', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockRedisService.set).toHaveBeenCalledWith(cacheKey, mockTransaction, 600);
            });

            it('should set 10 minutes (600 seconds) TTL for cache', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockRedisService.set).toHaveBeenCalledWith(expect.any(String), expect.any(Object), 600);
            });

            it('should use correct cache key format', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockRedisService.set).toHaveBeenCalledWith(
                    `transaction:${transactionId}`,
                    expect.any(Object),
                    600,
                );
            });

            it('should not update cache when transaction not found', async () => {
                mockRepository.findByExternalId.mockResolvedValue(null);

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow();

                expect(mockRedisService.set).not.toHaveBeenCalled();
            });
        });

        describe('logging', () => {
            it('should log APPROVED status update', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(mockLogger.log).toHaveBeenCalledWith(`Transaction approved: ${transactionId}`, undefined, {
                    transactionId,
                    status: TransactionStatus.APPROVED,
                });
            });

            it('should log REJECTED status update', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                await useCase.execute(transactionId, TransactionStatus.REJECTED);

                expect(mockLogger.log).toHaveBeenCalledWith(`Transaction rejected: ${transactionId}`, undefined, {
                    transactionId,
                    status: TransactionStatus.REJECTED,
                });
            });
        });

        describe('error handling', () => {
            it('should propagate repository findByExternalId errors', async () => {
                const error = new Error('Database connection error');
                mockRepository.findByExternalId.mockRejectedValue(error);

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow(
                    'Database connection error',
                );
            });

            it('should propagate repository update errors', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                const error = new Error('Update failed');
                mockRepository.update.mockRejectedValue(error);

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow(
                    'Update failed',
                );
            });

            it('should propagate Redis errors', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);
                mockRedisService.set.mockRejectedValue(new Error('Redis error'));

                await expect(useCase.execute(transactionId, TransactionStatus.APPROVED)).rejects.toThrow('Redis error');
            });
        });

        describe('edge cases', () => {
            it('should handle PENDING status (no-op)', async () => {
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.PENDING);

                expect(result.transactionStatus).toBe(TransactionStatus.PENDING);
                expect(mockRepository.update).toHaveBeenCalled();
            });

            it('should handle updating from APPROVED to REJECTED', async () => {
                mockTransaction.transactionStatus = TransactionStatus.APPROVED;
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.REJECTED);

                expect(result.transactionStatus).toBe(TransactionStatus.REJECTED);
            });

            it('should handle updating from REJECTED to APPROVED', async () => {
                mockTransaction.transactionStatus = TransactionStatus.REJECTED;
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(result.transactionStatus).toBe(TransactionStatus.APPROVED);
            });

            it('should handle idempotent APPROVED updates', async () => {
                mockTransaction.transactionStatus = TransactionStatus.APPROVED;
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.APPROVED);

                expect(result.transactionStatus).toBe(TransactionStatus.APPROVED);
                expect(mockRepository.update).toHaveBeenCalled();
            });

            it('should handle idempotent REJECTED updates', async () => {
                mockTransaction.transactionStatus = TransactionStatus.REJECTED;
                mockRepository.findByExternalId.mockResolvedValue(mockTransaction);
                mockRepository.update.mockResolvedValue(mockTransaction);

                const result = await useCase.execute(transactionId, TransactionStatus.REJECTED);

                expect(result.transactionStatus).toBe(TransactionStatus.REJECTED);
                expect(mockRepository.update).toHaveBeenCalled();
            });
        });
    });
});
