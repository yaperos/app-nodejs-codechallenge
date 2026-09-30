import { TransactionStatus } from '../enum/transaction-status.enum';
import { InvalidStatusTransitionError, InvalidTransactionError } from '../errors/domain.errors';
import { Transaction } from './transaction.entity';

const input = {
    accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
    accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
    transferTypeId: 1,
    value: 120,
};

describe('Transaction', () => {
    it('starts as pending with the given values', () => {
        const tx = Transaction.create(input);
        expect(tx.status).toBe(TransactionStatus.PENDING);
        expect(tx.value.amount).toBe(120);
        expect(tx.id).toBeDefined();
    });

    it('uses the id it receives', () => {
        expect(Transaction.create(input, 'custom-id').id).toBe('custom-id');
    });

    it('rejects the same debit and credit account', () => {
        expect(() =>
            Transaction.create({ ...input, accountExternalIdCredit: input.accountExternalIdDebit }),
        ).toThrow(InvalidTransactionError);
    });

    it('rejects unknown transfer types', () => {
        expect(() => Transaction.create({ ...input, transferTypeId: 99 })).toThrow(InvalidTransactionError);
    });

    it('rejects non-positive values', () => {
        expect(() => Transaction.create({ ...input, value: 0 })).toThrow(InvalidTransactionError);
    });

    it('approve and reject are idempotent', () => {
        const approved = Transaction.create(input);
        approved.approve();
        approved.approve();
        expect(approved.status).toBe(TransactionStatus.APPROVED);

        const rejected = Transaction.create(input);
        rejected.reject();
        rejected.reject();
        expect(rejected.status).toBe(TransactionStatus.REJECTED);
    });

    it('cannot flip a final status', () => {
        const rejected = Transaction.create(input);
        rejected.reject();
        expect(() => rejected.approve()).toThrow(InvalidStatusTransitionError);

        const approved = Transaction.create(input);
        approved.approve();
        expect(() => approved.reject()).toThrow(InvalidStatusTransitionError);
    });

    it('restore rebuilds the same state from a snapshot', () => {
        const original = Transaction.create(input);
        original.approve();

        const restored = Transaction.restore(original.toSnapshot());

        expect(restored.id).toBe(original.id);
        expect(restored.status).toBe(TransactionStatus.APPROVED);
        expect(restored.value.amount).toBe(120);
    });
});