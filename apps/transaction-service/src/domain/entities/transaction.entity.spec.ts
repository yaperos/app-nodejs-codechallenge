import { TransactionStatus } from '../value-objects/transaction-status.vo';
import { Transaction } from './transaction.entity';

describe('Transaction Entity', () => {
    let transaction: Transaction;

    beforeEach(() => {
        transaction = new Transaction(
            '123e4567-e89b-12d3-a456-426614174000',
            'account-debit-123',
            'account-credit-456',
            1,
            500,
            TransactionStatus.PENDING,
            new Date('2024-01-01T00:00:00Z'),
        );
    });

    describe('constructor', () => {
        it('should create a transaction with all properties', () => {
            expect(transaction.transactionExternalId).toBe('123e4567-e89b-12d3-a456-426614174000');
            expect(transaction.accountExternalIdDebit).toBe('account-debit-123');
            expect(transaction.accountExternalIdCredit).toBe('account-credit-456');
            expect(transaction.transferTypeId).toBe(1);
            expect(transaction.value).toBe(500);
            expect(transaction.transactionStatus).toBe(TransactionStatus.PENDING);
            expect(transaction.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
        });

        it('should set default createdAt to current date when not provided', () => {
            const now = new Date();
            const txn = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                'account-debit-123',
                'account-credit-456',
                1,
                500,
                TransactionStatus.PENDING,
            );

            expect(txn.createdAt.getTime()).toBeGreaterThanOrEqual(now.getTime());
        });
    });

    describe('approve', () => {
        it('should change status to APPROVED', () => {
            transaction.approve();
            expect(transaction.transactionStatus).toBe(TransactionStatus.APPROVED);
        });

        it('should allow approving from PENDING status', () => {
            transaction.transactionStatus = TransactionStatus.PENDING;
            transaction.approve();
            expect(transaction.transactionStatus).toBe(TransactionStatus.APPROVED);
        });

        it('should allow approving from REJECTED status', () => {
            transaction.transactionStatus = TransactionStatus.REJECTED;
            transaction.approve();
            expect(transaction.transactionStatus).toBe(TransactionStatus.APPROVED);
        });
    });

    describe('reject', () => {
        it('should change status to REJECTED', () => {
            transaction.reject();
            expect(transaction.transactionStatus).toBe(TransactionStatus.REJECTED);
        });

        it('should allow rejecting from PENDING status', () => {
            transaction.transactionStatus = TransactionStatus.PENDING;
            transaction.reject();
            expect(transaction.transactionStatus).toBe(TransactionStatus.REJECTED);
        });

        it('should allow rejecting from APPROVED status', () => {
            transaction.transactionStatus = TransactionStatus.APPROVED;
            transaction.reject();
            expect(transaction.transactionStatus).toBe(TransactionStatus.REJECTED);
        });
    });

    describe('isPending', () => {
        it('should return true when status is PENDING', () => {
            transaction.transactionStatus = TransactionStatus.PENDING;
            expect(transaction.isPending()).toBe(true);
        });

        it('should return false when status is APPROVED', () => {
            transaction.transactionStatus = TransactionStatus.APPROVED;
            expect(transaction.isPending()).toBe(false);
        });

        it('should return false when status is REJECTED', () => {
            transaction.transactionStatus = TransactionStatus.REJECTED;
            expect(transaction.isPending()).toBe(false);
        });
    });

    describe('isApproved', () => {
        it('should return true when status is APPROVED', () => {
            transaction.transactionStatus = TransactionStatus.APPROVED;
            expect(transaction.isApproved()).toBe(true);
        });

        it('should return false when status is PENDING', () => {
            transaction.transactionStatus = TransactionStatus.PENDING;
            expect(transaction.isApproved()).toBe(false);
        });

        it('should return false when status is REJECTED', () => {
            transaction.transactionStatus = TransactionStatus.REJECTED;
            expect(transaction.isApproved()).toBe(false);
        });
    });

    describe('isRejected', () => {
        it('should return true when status is REJECTED', () => {
            transaction.transactionStatus = TransactionStatus.REJECTED;
            expect(transaction.isRejected()).toBe(true);
        });

        it('should return false when status is PENDING', () => {
            transaction.transactionStatus = TransactionStatus.PENDING;
            expect(transaction.isRejected()).toBe(false);
        });

        it('should return false when status is APPROVED', () => {
            transaction.transactionStatus = TransactionStatus.APPROVED;
            expect(transaction.isRejected()).toBe(false);
        });
    });

    describe('shouldBeRejected', () => {
        it('should return true when value is greater than 1000', () => {
            const highValueTxn = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                'account-debit-123',
                'account-credit-456',
                1,
                1001,
                TransactionStatus.PENDING,
            );

            expect(highValueTxn.shouldBeRejected()).toBe(true);
        });

        it('should return false when value equals 1000', () => {
            const exactValueTxn = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                'account-debit-123',
                'account-credit-456',
                1,
                1000,
                TransactionStatus.PENDING,
            );

            expect(exactValueTxn.shouldBeRejected()).toBe(false);
        });

        it('should return false when value is less than 1000', () => {
            expect(transaction.shouldBeRejected()).toBe(false);
        });

        it('should return false for zero value', () => {
            const zeroValueTxn = new Transaction(
                '123e4567-e89b-12d3-a456-426614174000',
                'account-debit-123',
                'account-credit-456',
                1,
                0,
                TransactionStatus.PENDING,
            );

            expect(zeroValueTxn.shouldBeRejected()).toBe(false);
        });
    });
});
