import type { RequestContext } from '@app/common';
import type { LoggerService } from '@app/observability';
import { Transaction } from '@domain/entities/transaction.entity';
import type { ITransactionRepository } from '@domain/repositories/transaction.repository.interface';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import type { IEventPublisher } from '../../domain/ports/output/event-publisher.interface';
import { CreateTransactionUseCase } from './create-transaction.use-case';

jest.mock('uuid', () => ({
    v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));

describe('CreateTransactionUseCase', () => {
    let useCase: CreateTransactionUseCase;
    let mockRepository: jest.Mocked<ITransactionRepository>;
    let mockEventPublisher: jest.Mocked<IEventPublisher>;
    let mockLogger: jest.Mocked<LoggerService>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findByExternalId: jest.fn(),
            update: jest.fn(),
        } as jest.Mocked<ITransactionRepository>;

        mockEventPublisher = {
            publishTransactionCreated: jest.fn(),
            publishTransactionStatusUpdated: jest.fn(),
        } as jest.Mocked<IEventPublisher>;

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;

        useCase = new CreateTransactionUseCase(mockRepository, mockEventPublisher, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('execute', () => {
        const createDto = {
            accountExternalIdDebit: 'debit-account-123',
            accountExternalIdCredit: 'credit-account-456',
            tranferTypeId: 1,
            value: 500,
        };

        const context: Partial<RequestContext> = {
            correlationId: 'correlation-123',
            requestId: 'request-456',
            service: 'TransactionService',
        };

        it('should create a transaction with PENDING status', async () => {
            const expectedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                expect.any(Date),
            );

            mockRepository.save.mockResolvedValue(expectedTransaction);

            const result = await useCase.execute(createDto, context);

            expect(result).toEqual(expectedTransaction);
            expect(result.transactionStatus).toBe(TransactionStatus.PENDING);
        });

        it('should generate a UUID for transactionExternalId', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            const result = await useCase.execute(createDto, context);

            expect(result.transactionExternalId).toBe('123e4567-e89b-12d3-a456-426614174000');
        });

        it('should save transaction via repository', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                expect.any(Date),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            await useCase.execute(createDto, context);

            expect(mockRepository.save).toHaveBeenCalledTimes(1);
            expect(mockRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    transactionExternalId: '123e4567-e89b-12d3-a456-426614174000',
                    accountExternalIdDebit: createDto.accountExternalIdDebit,
                    accountExternalIdCredit: createDto.accountExternalIdCredit,
                    transferTypeId: createDto.tranferTypeId,
                    value: createDto.value,
                    transactionStatus: TransactionStatus.PENDING,
                }),
            );
        });

        it('should publish transaction created event with correct payload', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                new Date('2024-01-01T00:00:00Z'),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            await useCase.execute(createDto, context);

            expect(mockEventPublisher.publishTransactionCreated).toHaveBeenCalledTimes(1);
            expect(mockEventPublisher.publishTransactionCreated).toHaveBeenCalledWith(
                {
                    transactionExternalId: '123e4567-e89b-12d3-a456-426614174000',
                    accountExternalIdDebit: createDto.accountExternalIdDebit,
                    accountExternalIdCredit: createDto.accountExternalIdCredit,
                    transferTypeId: createDto.tranferTypeId,
                    value: createDto.value,
                    transactionStatus: TransactionStatus.PENDING,
                    createdAt: savedTransaction.createdAt,
                },
                context,
            );
        });

        it('should log transaction creation with context', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            await useCase.execute(createDto, context);

            expect(mockLogger.log).toHaveBeenCalledWith('Creating transaction', context, { dto: createDto });
            expect(mockLogger.log).toHaveBeenCalledWith(
                `Transaction created: ${savedTransaction.transactionExternalId}`,
                context,
                {
                    transactionId: savedTransaction.transactionExternalId,
                    value: savedTransaction.value,
                },
            );
        });

        it('should work without context', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            const result = await useCase.execute(createDto);

            expect(result).toEqual(savedTransaction);
            expect(mockEventPublisher.publishTransactionCreated).toHaveBeenCalledWith(expect.any(Object), undefined);
        });

        it('should propagate repository errors', async () => {
            const error = new Error('Database error');
            mockRepository.save.mockRejectedValue(error);

            await expect(useCase.execute(createDto, context)).rejects.toThrow('Database error');
        });

        it('should propagate event publisher errors', async () => {
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                createDto.tranferTypeId,
                createDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);
            mockEventPublisher.publishTransactionCreated.mockRejectedValue(new Error('Kafka error'));

            await expect(useCase.execute(createDto, context)).rejects.toThrow('Kafka error');
        });

        it('should handle zero value transactions', async () => {
            const zeroValueDto = { ...createDto, value: 0 };
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                zeroValueDto.accountExternalIdDebit,
                zeroValueDto.accountExternalIdCredit,
                zeroValueDto.tranferTypeId,
                0,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            const result = await useCase.execute(zeroValueDto, context);

            expect(result.value).toBe(0);
        });

        it('should handle large value transactions', async () => {
            const largeValueDto = { ...createDto, value: 999999.99 };
            const savedTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                largeValueDto.accountExternalIdDebit,
                largeValueDto.accountExternalIdCredit,
                largeValueDto.tranferTypeId,
                999999.99,
                TransactionStatus.PENDING,
                new Date(),
            );

            mockRepository.save.mockResolvedValue(savedTransaction);

            const result = await useCase.execute(largeValueDto, context);

            expect(result.value).toBe(999999.99);
        });
    });
});
