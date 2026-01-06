import { TransactionType } from './transaction-type.vo';

describe('TransactionType', () => {
    describe('create', () => {
        it('should create a valid transaction type for TRANSFER', () => {
            const transactionType = TransactionType.create(1);

            expect(transactionType.id).toBe(1);
            expect(transactionType.name).toBe('Transfer');
        });

        it('should create a valid transaction type for PAYMENT', () => {
            const transactionType = TransactionType.create(2);

            expect(transactionType.id).toBe(2);
            expect(transactionType.name).toBe('Payment');
        });

        it('should create a valid transaction type for WITHDRAWAL', () => {
            const transactionType = TransactionType.create(3);

            expect(transactionType.id).toBe(3);
            expect(transactionType.name).toBe('Withdrawal');
        });

        it('should return "Unknown" for invalid transaction type id', () => {
            const transactionType = TransactionType.create(999);

            expect(transactionType.id).toBe(999);
            expect(transactionType.name).toBe('Unknown');
        });
    });

    describe('constructor', () => {
        it('should create transaction type with provided values', () => {
            const transactionType = new TransactionType(1, 'Test Type');

            expect(transactionType.id).toBe(1);
            expect(transactionType.name).toBe('Test Type');
        });
    });
});
