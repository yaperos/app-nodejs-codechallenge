import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../../domain/enum/transaction-status.enum';

import { TransactionNotFoundError } from '../../../domain/errors/domain.errors';
import type { UnitOfWorkPort } from '../../../domain/ports/unit-of-work.port';
import type { TransactionCachePort } from '../../ports/transaction-cache.port';
import { UpdateTransactionStatusCommand } from './update-transaction-status.command';
import { UpdateTransactionStatusHandler } from './update-transaction-status.handler';

const ID = '44444444-4444-4444-8444-444444444444';

const pendingTransaction = () =>
    Transaction.create(
        {
            accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
            accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
            transferTypeId: 1,
            value: 120,
        },
        ID,
    );

function setup(options: { firstTime?: boolean; transaction?: Transaction | null } = {}) {
    const { firstTime = true, transaction = pendingTransaction() } = options;
    const update = jest.fn().mockResolvedValue(undefined);
    const markProcessed = jest.fn().mockResolvedValue(firstTime);
    const findById = jest.fn().mockResolvedValue(transaction);
    const invalidate = jest.fn().mockResolvedValue(undefined);

    const unitOfWork = {
        run: (work: (ctx: unknown) => Promise<unknown>) =>
            work({ transactions: { findById, update }, processedMessages: { markProcessed }, outbox: {} }),
    } as unknown as UnitOfWorkPort;
    const cache = { invalidate } as unknown as TransactionCachePort;

    return {
        handler: new UpdateTransactionStatusHandler(unitOfWork, cache),
        transaction,
        update,
        findById,
        invalidate,
    };
}

describe('UpdateTransactionStatusHandler', () => {
    it('approves the transaction, saves it and invalidates the cache', async () => {
        const { handler, transaction, update, invalidate } = setup();

        await handler.execute(new UpdateTransactionStatusCommand(ID, 'approved', 'evt-1'));

        expect(transaction?.status).toBe(TransactionStatus.APPROVED);
        expect(update).toHaveBeenCalledWith(transaction);
        expect(invalidate).toHaveBeenCalledWith(ID);
    });

    it('rejects the transaction when the status is rejected', async () => {
        const { handler, transaction } = setup();

        await handler.execute(new UpdateTransactionStatusCommand(ID, 'rejected', 'evt-2'));

        expect(transaction?.status).toBe(TransactionStatus.REJECTED);
    });

    it('ignores a duplicated event', async () => {
        const { handler, findById, update, invalidate } = setup({ firstTime: false });

        await handler.execute(new UpdateTransactionStatusCommand(ID, 'approved', 'evt-1'));

        expect(findById).not.toHaveBeenCalled();
        expect(update).not.toHaveBeenCalled();
        expect(invalidate).not.toHaveBeenCalled();
    });

    it('fails when the transaction does not exist', async () => {
        const { handler, invalidate } = setup({ transaction: null });

        await expect(
            handler.execute(new UpdateTransactionStatusCommand(ID, 'approved', 'evt-3')),
        ).rejects.toBeInstanceOf(TransactionNotFoundError);
        expect(invalidate).not.toHaveBeenCalled();
    });
});