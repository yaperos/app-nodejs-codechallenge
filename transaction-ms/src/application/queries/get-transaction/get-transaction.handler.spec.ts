import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionNotFoundError } from '../../../domain/errors/domain.errors';
import type { TransactionRepositoryPort } from '../../../domain/ports/transaction.repository.port';
import type { TransactionView } from '../../dtos/transaction.view';
import type { TransactionCachePort } from '../../ports/transaction-cache.port';
import { GetTransactionHandler } from './get-transaction.handler';
import { GetTransactionQuery } from './get-transaction.query';

const ID = '44444444-4444-4444-8444-444444444444';

const newTransaction = () =>
    Transaction.create(
        {
            accountExternalIdDebit: '11111111-1111-4111-8111-111111111111',
            accountExternalIdCredit: '22222222-2222-4222-8222-222222222222',
            transferTypeId: 1,
            value: 120,
        },
        ID,
    );

function setup(options: { cached?: TransactionView | null; transaction?: Transaction | null }) {
    const get = jest.fn().mockResolvedValue(options.cached ?? null);
    const set = jest.fn().mockResolvedValue(undefined);
    const findById = jest.fn().mockResolvedValue(options.transaction ?? null);
    const handler = new GetTransactionHandler(
        { findById } as unknown as TransactionRepositoryPort,
        { get, set } as unknown as TransactionCachePort,
    );
    return { handler, get, set, findById };
}

describe('GetTransactionHandler', () => {
    it('returns the cached view without touching the database', async () => {
        const cached: TransactionView = {
            transactionExternalId: ID,
            transactionType: { name: 'TRANSFER' },
            transactionStatus: { name: 'approved' },
            value: 120,
            createdAt: '2026-01-01T00:00:00.000Z',
        };
        const { handler, findById, set } = setup({ cached });

        await expect(handler.execute(new GetTransactionQuery(ID))).resolves.toEqual(cached);
        expect(findById).not.toHaveBeenCalled();
        expect(set).not.toHaveBeenCalled();
    });

    it('caches pending transactions with a short TTL', async () => {
        const { handler, set } = setup({ transaction: newTransaction() });

        const view = await handler.execute(new GetTransactionQuery(ID));

        expect(view.transactionStatus.name).toBe('pending');
        expect(set).toHaveBeenCalledWith(expect.objectContaining({ transactionExternalId: ID }), 5);
    });

    it('caches final transactions with a long TTL', async () => {
        const transaction = newTransaction();
        transaction.approve();
        const { handler, set } = setup({ transaction });

        await handler.execute(new GetTransactionQuery(ID));

        expect(set).toHaveBeenCalledWith(expect.objectContaining({ transactionExternalId: ID }), 3600);
    });

    it('fails when the transaction does not exist', async () => {
        const { handler, set } = setup({ transaction: null });

        await expect(handler.execute(new GetTransactionQuery(ID))).rejects.toBeInstanceOf(
            TransactionNotFoundError,
        );
        expect(set).not.toHaveBeenCalled();
    });
});