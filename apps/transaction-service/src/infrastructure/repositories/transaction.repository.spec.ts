import type { DrizzleClient } from '@app/common';
import { Transaction } from '@domain/entities/transaction.entity';
import { TransactionStatus } from '@domain/value-objects/transaction-status.vo';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
    let repository: TransactionRepository;
    let mockDb: jest.Mocked<DrizzleClient>;

    beforeEach(() => {
        const mockReturning = jest.fn();
        const mockWhere = jest
            .fn()
            .mockReturnValue({ returning: mockReturning, limit: jest.fn().mockResolvedValue([]) });
        const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
        const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
        const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });

        mockDb = {
            insert: jest.fn().mockReturnValue({ values: mockValues }),
            select: jest.fn().mockReturnValue({ from: mockFrom }),
            update: jest.fn().mockReturnValue({ set: mockSet }),
        } as any;

        repository = new TransactionRepository(mockDb);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('save', () => {
        it('should save a transaction and return the saved entity', async () => {
            const transaction = new Transaction(
                'txn-123',
                'debit-account-123',
                'credit-account-456',
                1,
                500.5,
                TransactionStatus.PENDING,
                new Date('2024-01-01T00:00:00Z'),
            );

            const dbResult = {
                id: 1,
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'debit-account-123',
                accountExternalIdCredit: 'credit-account-456',
                transferTypeId: 1,
                value: '500.50',
                transactionStatus: 'pending',
                createdAt: new Date('2024-01-01T00:00:00Z'),
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            const result = await repository.save(transaction);

            expect(mockDb.insert).toHaveBeenCalled();
            expect(mockValues).toHaveBeenCalledWith({
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'debit-account-123',
                accountExternalIdCredit: 'credit-account-456',
                transferTypeId: 1,
                value: '500.5',
                transactionStatus: 'pending',
                createdAt: transaction.createdAt,
            });
            expect(result).toBeInstanceOf(Transaction);
            expect(result.transactionExternalId).toBe('txn-123');
            expect(result.value).toBe(500.5);
        });

        it('should convert number value to string for database', async () => {
            const transaction = new Transaction(
                'txn-456',
                'debit-account',
                'credit-account',
                2,
                1000,
                TransactionStatus.PENDING,
                new Date(),
            );

            const dbResult = {
                transactionExternalId: 'txn-456',
                accountExternalIdDebit: 'debit-account',
                accountExternalIdCredit: 'credit-account',
                transferTypeId: 2,
                value: '1000',
                transactionStatus: 'pending',
                createdAt: new Date(),
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            await repository.save(transaction);

            expect(mockValues).toHaveBeenCalledWith(
                expect.objectContaining({
                    value: '1000',
                }),
            );
        });

        it('should handle decimal values correctly', async () => {
            const transaction = new Transaction(
                'txn-789',
                'debit-account',
                'credit-account',
                1,
                123.45,
                TransactionStatus.PENDING,
                new Date(),
            );

            const dbResult = {
                transactionExternalId: 'txn-789',
                accountExternalIdDebit: 'debit-account',
                accountExternalIdCredit: 'credit-account',
                transferTypeId: 1,
                value: '123.45',
                transactionStatus: 'pending',
                createdAt: new Date(),
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockValues = jest.fn().mockReturnValue({ returning: mockReturning });
            mockDb.insert = jest.fn().mockReturnValue({ values: mockValues });

            const result = await repository.save(transaction);

            expect(result.value).toBe(123.45);
        });
    });

    describe('findByExternalId', () => {
        it('should find and return a transaction by external ID', async () => {
            const dbResult = {
                id: 1,
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'debit-account-123',
                accountExternalIdCredit: 'credit-account-456',
                transferTypeId: 1,
                value: '750.25',
                transactionStatus: 'approved',
                createdAt: new Date('2024-01-01T00:00:00Z'),
            };

            const mockLimit = jest.fn().mockResolvedValue([dbResult]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findByExternalId('txn-123');

            expect(mockDb.select).toHaveBeenCalled();
            expect(mockFrom).toHaveBeenCalled();
            expect(mockWhere).toHaveBeenCalled();
            expect(mockLimit).toHaveBeenCalledWith(1);
            expect(result).toBeInstanceOf(Transaction);
            expect(result?.transactionExternalId).toBe('txn-123');
            expect(result?.transactionStatus).toBe('approved');
            expect(result?.value).toBe(750.25);
        });

        it('should return null when transaction not found', async () => {
            const mockLimit = jest.fn().mockResolvedValue([]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findByExternalId('non-existent-id');

            expect(result).toBeNull();
        });

        it('should parse string value to float', async () => {
            const dbResult = {
                transactionExternalId: 'txn-999',
                accountExternalIdDebit: 'debit-account',
                accountExternalIdCredit: 'credit-account',
                transferTypeId: 3,
                value: '999.99',
                transactionStatus: 'pending',
                createdAt: new Date(),
            };

            const mockLimit = jest.fn().mockResolvedValue([dbResult]);
            const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
            const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

            const result = await repository.findByExternalId('txn-999');

            expect(result?.value).toBe(999.99);
            expect(typeof result?.value).toBe('number');
        });
    });

    describe('update', () => {
        it('should update transaction status and return updated entity', async () => {
            const transaction = new Transaction(
                'txn-123',
                'debit-account-123',
                'credit-account-456',
                1,
                500,
                TransactionStatus.APPROVED,
                new Date('2024-01-01T00:00:00Z'),
            );

            const dbResult = {
                transactionExternalId: 'txn-123',
                accountExternalIdDebit: 'debit-account-123',
                accountExternalIdCredit: 'credit-account-456',
                transferTypeId: 1,
                value: '500',
                transactionStatus: 'approved',
                createdAt: new Date('2024-01-01T00:00:00Z'),
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
            const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.update = jest.fn().mockReturnValue({ set: mockSet });

            const result = await repository.update(transaction);

            expect(mockDb.update).toHaveBeenCalled();
            expect(mockSet).toHaveBeenCalledWith({
                transactionStatus: 'approved',
            });
            expect(mockWhere).toHaveBeenCalled();
            expect(result).toBeInstanceOf(Transaction);
            expect(result.transactionStatus).toBe('approved');
        });

        it('should update to REJECTED status', async () => {
            const transaction = new Transaction(
                'txn-456',
                'debit-account',
                'credit-account',
                2,
                1500,
                TransactionStatus.REJECTED,
                new Date(),
            );

            const dbResult = {
                transactionExternalId: 'txn-456',
                accountExternalIdDebit: 'debit-account',
                accountExternalIdCredit: 'credit-account',
                transferTypeId: 2,
                value: '1500',
                transactionStatus: 'rejected',
                createdAt: new Date(),
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
            const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.update = jest.fn().mockReturnValue({ set: mockSet });

            const result = await repository.update(transaction);

            expect(mockSet).toHaveBeenCalledWith({
                transactionStatus: 'rejected',
            });
            expect(result.transactionStatus).toBe('rejected');
        });

        it('should preserve other fields during update', async () => {
            const originalDate = new Date('2024-01-01T00:00:00Z');
            const transaction = new Transaction(
                'txn-789',
                'debit-original',
                'credit-original',
                1,
                250.75,
                TransactionStatus.APPROVED,
                originalDate,
            );

            const dbResult = {
                transactionExternalId: 'txn-789',
                accountExternalIdDebit: 'debit-original',
                accountExternalIdCredit: 'credit-original',
                transferTypeId: 1,
                value: '250.75',
                transactionStatus: 'approved',
                createdAt: originalDate,
            };

            const mockReturning = jest.fn().mockResolvedValue([dbResult]);
            const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
            const mockSet = jest.fn().mockReturnValue({ where: mockWhere });
            mockDb.update = jest.fn().mockReturnValue({ set: mockSet });

            const result = await repository.update(transaction);

            expect(result.transactionExternalId).toBe('txn-789');
            expect(result.accountExternalIdDebit).toBe('debit-original');
            expect(result.accountExternalIdCredit).toBe('credit-original');
            expect(result.value).toBe(250.75);
            expect(result.createdAt).toEqual(originalDate);
        });
    });

    describe('mapToDomain', () => {
        it('should map all transaction statuses correctly', async () => {
            const statuses = [TransactionStatus.PENDING, TransactionStatus.APPROVED, TransactionStatus.REJECTED];

            for (const status of statuses) {
                const dbResult = {
                    transactionExternalId: 'txn-test',
                    accountExternalIdDebit: 'debit',
                    accountExternalIdCredit: 'credit',
                    transferTypeId: 1,
                    value: '100',
                    transactionStatus: status,
                    createdAt: new Date(),
                };

                const mockLimit = jest.fn().mockResolvedValue([dbResult]);
                const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
                const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
                mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

                const result = await repository.findByExternalId('txn-test');

                expect(result?.transactionStatus).toBe(status);
            }
        });

        it('should handle all transfer type IDs', async () => {
            const transferTypes = [1, 2, 3];

            for (const typeId of transferTypes) {
                const dbResult = {
                    transactionExternalId: 'txn-test',
                    accountExternalIdDebit: 'debit',
                    accountExternalIdCredit: 'credit',
                    transferTypeId: typeId,
                    value: '100',
                    transactionStatus: 'pending',
                    createdAt: new Date(),
                };

                const mockLimit = jest.fn().mockResolvedValue([dbResult]);
                const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
                const mockFrom = jest.fn().mockReturnValue({ where: mockWhere });
                mockDb.select = jest.fn().mockReturnValue({ from: mockFrom });

                const result = await repository.findByExternalId('txn-test');

                expect(result?.transferTypeId).toBe(typeId);
            }
        });
    });
});
