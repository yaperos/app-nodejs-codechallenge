import type { LoggerService } from '@app/observability';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import type { ICreateTransactionUseCase } from '../../domain/ports/input/create-transaction.use-case.interface';
import type { IGetTransactionUseCase } from '../../domain/ports/input/get-transaction.use-case.interface';
import type { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionController } from './transaction.controller';

describe('TransactionController', () => {
    let controller: TransactionController;
    let mockCreateUseCase: jest.Mocked<ICreateTransactionUseCase>;
    let mockGetUseCase: jest.Mocked<IGetTransactionUseCase>;
    let mockLogger: jest.Mocked<LoggerService>;

    beforeEach(() => {
        mockCreateUseCase = {
            execute: jest.fn(),
        } as jest.Mocked<ICreateTransactionUseCase>;

        mockGetUseCase = {
            execute: jest.fn(),
        } as jest.Mocked<IGetTransactionUseCase>;

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;

        controller = new TransactionController(mockCreateUseCase, mockGetUseCase, mockLogger);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTransaction', () => {
        const createDto: CreateTransactionDto = {
            accountExternalIdDebit: 'debit-account-123',
            accountExternalIdCredit: 'credit-account-456',
            tranferTypeId: 1,
            value: 500,
        };

        const mockRequest = {
            correlationId: 'correlation-123',
            requestId: 'request-456',
            ip: '127.0.0.1',
            headers: {
                'user-agent': 'Jest Test Agent',
            },
        } as any as Request;

        const mockTransaction = new Transaction(
            '123e4567-e89b-12d3-a456-426614174000',
            createDto.accountExternalIdDebit,
            createDto.accountExternalIdCredit,
            createDto.tranferTypeId,
            createDto.value,
            TransactionStatus.PENDING,
            new Date('2024-01-01T00:00:00Z'),
        );

        it('should create a transaction and return response DTO', async () => {
            mockCreateUseCase.execute.mockResolvedValue(mockTransaction);

            const result = await controller.createTransaction(createDto, mockRequest);

            expect(result).toEqual({
                transactionExternalId: '123e4567-e89b-12d3-a456-426614174000',
                transactionType: { name: 'Transfer' },
                transactionStatus: { name: 'pending' },
                value: 500,
                createdAt: mockTransaction.createdAt,
            });
        });

        it('should extract context from request', async () => {
            mockCreateUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.createTransaction(createDto, mockRequest);

            expect(mockCreateUseCase.execute).toHaveBeenCalledWith(createDto, {
                correlationId: 'correlation-123',
                requestId: 'request-456',
                ipAddress: '127.0.0.1',
                userAgent: 'Jest Test Agent',
            });
        });

        it('should log transaction creation', async () => {
            mockCreateUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.createTransaction(createDto, mockRequest);

            expect(mockLogger.log).toHaveBeenCalledWith(
                'Creating transaction',
                expect.objectContaining({
                    correlationId: 'correlation-123',
                    requestId: 'request-456',
                }),
                {
                    accountDebit: createDto.accountExternalIdDebit,
                    accountCredit: createDto.accountExternalIdCredit,
                    value: createDto.value,
                },
            );
        });

        it('should log successful transaction creation', async () => {
            mockCreateUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.createTransaction(createDto, mockRequest);

            expect(mockLogger.log).toHaveBeenCalledWith('Transaction created successfully', expect.any(Object), {
                transactionId: '123e4567-e89b-12d3-a456-426614174000',
            });
        });

        it('should map transfer type 1 to Transfer', async () => {
            const transferTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                createDto.accountExternalIdDebit,
                createDto.accountExternalIdCredit,
                1,
                createDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );
            mockCreateUseCase.execute.mockResolvedValue(transferTransaction);

            const result = await controller.createTransaction(createDto, mockRequest);

            expect(result.transactionType.name).toBe('Transfer');
        });

        it('should map transfer type 2 to Payment', async () => {
            const paymentDto = { ...createDto, tranferTypeId: 2 };
            const paymentTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                paymentDto.accountExternalIdDebit,
                paymentDto.accountExternalIdCredit,
                2,
                paymentDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );
            mockCreateUseCase.execute.mockResolvedValue(paymentTransaction);

            const result = await controller.createTransaction(paymentDto, mockRequest);

            expect(result.transactionType.name).toBe('Payment');
        });

        it('should map transfer type 3 to Withdrawal', async () => {
            const withdrawalDto = { ...createDto, tranferTypeId: 3 };
            const withdrawalTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                withdrawalDto.accountExternalIdDebit,
                withdrawalDto.accountExternalIdCredit,
                3,
                withdrawalDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );
            mockCreateUseCase.execute.mockResolvedValue(withdrawalTransaction);

            const result = await controller.createTransaction(withdrawalDto, mockRequest);

            expect(result.transactionType.name).toBe('Withdrawal');
        });

        it('should handle unknown transfer types', async () => {
            const unknownDto = { ...createDto, tranferTypeId: 999 };
            const unknownTransaction = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                unknownDto.accountExternalIdDebit,
                unknownDto.accountExternalIdCredit,
                999,
                unknownDto.value,
                TransactionStatus.PENDING,
                new Date(),
            );
            mockCreateUseCase.execute.mockResolvedValue(unknownTransaction);

            const result = await controller.createTransaction(unknownDto, mockRequest);

            expect(result.transactionType.name).toBe('Unknown');
        });

        it('should handle requests without correlationId', async () => {
            const requestWithoutIds = {
                ip: '127.0.0.1',
                headers: { 'user-agent': 'Test' },
            } as any as Request;

            mockCreateUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.createTransaction(createDto, requestWithoutIds);

            expect(mockCreateUseCase.execute).toHaveBeenCalledWith(createDto, {
                correlationId: undefined,
                requestId: undefined,
                ipAddress: '127.0.0.1',
                userAgent: 'Test',
            });
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Use case error');
            mockCreateUseCase.execute.mockRejectedValue(error);

            await expect(controller.createTransaction(createDto, mockRequest)).rejects.toThrow('Use case error');
        });
    });

    describe('getTransaction', () => {
        const transactionId = '123e4567-e89b-12d3-a456-426614174000';

        const mockRequest = {
            correlationId: 'correlation-123',
            requestId: 'request-456',
            ip: '127.0.0.1',
            headers: {
                'user-agent': 'Jest Test Agent',
            },
        } as any as Request;

        const mockTransaction = new Transaction(
            transactionId,
            'debit-account-123',
            'credit-account-456',
            1,
            500,
            TransactionStatus.APPROVED,
            new Date('2024-01-01T00:00:00Z'),
        );

        it('should get transaction and return response DTO', async () => {
            mockGetUseCase.execute.mockResolvedValue(mockTransaction);

            const result = await controller.getTransaction(transactionId, mockRequest);

            expect(result).toEqual({
                transactionExternalId: transactionId,
                transactionType: { name: 'Transfer' },
                transactionStatus: { name: 'approved' },
                value: 500,
                createdAt: mockTransaction.createdAt,
            });
        });

        it('should call use case with transaction ID', async () => {
            mockGetUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.getTransaction(transactionId, mockRequest);

            expect(mockGetUseCase.execute).toHaveBeenCalledWith(transactionId);
        });

        it('should log transaction fetch', async () => {
            mockGetUseCase.execute.mockResolvedValue(mockTransaction);

            await controller.getTransaction(transactionId, mockRequest);

            expect(mockLogger.log).toHaveBeenCalledWith(
                'Fetching transaction',
                expect.objectContaining({
                    correlationId: 'correlation-123',
                    requestId: 'request-456',
                }),
                {
                    transactionId,
                },
            );
        });

        it('should map PENDING status correctly', async () => {
            const pendingTransaction = new Transaction(
                transactionId,
                'debit-account-123',
                'credit-account-456',
                1,
                500,
                TransactionStatus.PENDING,
                new Date(),
            );
            mockGetUseCase.execute.mockResolvedValue(pendingTransaction);

            const result = await controller.getTransaction(transactionId, mockRequest);

            expect(result.transactionStatus.name).toBe('pending');
        });

        it('should map REJECTED status correctly', async () => {
            const rejectedTransaction = new Transaction(
                transactionId,
                'debit-account-123',
                'credit-account-456',
                1,
                500,
                TransactionStatus.REJECTED,
                new Date(),
            );
            mockGetUseCase.execute.mockResolvedValue(rejectedTransaction);

            const result = await controller.getTransaction(transactionId, mockRequest);

            expect(result.transactionStatus.name).toBe('rejected');
        });

        it('should propagate NotFoundException from use case', async () => {
            mockGetUseCase.execute.mockRejectedValue(new NotFoundException('Transaction not found'));

            await expect(controller.getTransaction(transactionId, mockRequest)).rejects.toThrow(NotFoundException);
        });

        it('should propagate use case errors', async () => {
            const error = new Error('Database error');
            mockGetUseCase.execute.mockRejectedValue(error);

            await expect(controller.getTransaction(transactionId, mockRequest)).rejects.toThrow('Database error');
        });
    });

    describe('mapToResponse (private method)', () => {
        it('should map all transaction fields correctly', async () => {
            const transaction = new Transaction(
                'txn-123',
                'debit-123',
                'credit-456',
                2,
                1000,
                TransactionStatus.APPROVED,
                new Date('2024-06-15T12:00:00Z'),
            );

            mockGetUseCase.execute.mockResolvedValue(transaction);

            const mockReq = {
                correlationId: 'correlation-123',
                requestId: 'request-456',
                ip: '127.0.0.1',
                headers: {
                    'user-agent': 'Jest Test Agent',
                },
            } as any as Request;

            const result = await controller.getTransaction('txn-123', mockReq);

            expect(result).toEqual({
                transactionExternalId: 'txn-123',
                transactionType: { name: 'Payment' },
                transactionStatus: { name: 'approved' },
                value: 1000,
                createdAt: transaction.createdAt,
            });
        });
    });
});
