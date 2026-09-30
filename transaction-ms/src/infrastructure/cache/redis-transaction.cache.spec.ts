import { Logger } from '@nestjs/common';
import type { Redis } from 'ioredis';
import type { TransactionView } from '../../application/dtos/transaction.view';
import { RedisTransactionCache } from './redis-transaction.cache';

const view: TransactionView = {
    transactionExternalId: 'id-1',
    transactionType: { name: 'TRANSFER' },
    transactionStatus: { name: 'pending' },
    value: 120,
    createdAt: '2026-01-01T00:00:00.000Z',
};

function setup(get: jest.Mock = jest.fn().mockResolvedValue(null)) {
    const redis = {
        get,
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
    };
    return { cache: new RedisTransactionCache(redis as unknown as Redis), redis };
}

describe('RedisTransactionCache', () => {
    beforeEach(() => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation();
        jest.spyOn(Logger.prototype, 'error').mockImplementation();
    });
    afterEach(() => jest.restoreAllMocks());

    it('returns the parsed view on a hit', async () => {
        const { cache } = setup(jest.fn().mockResolvedValue(JSON.stringify(view)));
        await expect(cache.get('id-1')).resolves.toEqual(view);
    });

    it('returns null on a miss', async () => {
        const { cache } = setup();
        await expect(cache.get('id-1')).resolves.toBeNull();
    });

    it('fails open: returns null when Redis throws', async () => {
        const { cache } = setup(jest.fn().mockRejectedValue(new Error('redis down')));
        await expect(cache.get('id-1')).resolves.toBeNull();
    });

    it('stores the view with a TTL', async () => {
        const { cache, redis } = setup();
        await cache.set(view, 60);
        expect(redis.set).toHaveBeenCalledWith('transaction:id-1', JSON.stringify(view), 'EX', 60);
    });

    it('invalidates the key', async () => {
        const { cache, redis } = setup();
        await cache.invalidate('id-1');
        expect(redis.del).toHaveBeenCalledWith('transaction:id-1');
    });

    it('stops calling Redis once the circuit is open', async () => {
        const get = jest.fn().mockRejectedValue(new Error('redis down'));
        const { cache } = setup(get);

        for (let i = 0; i < 6; i++) await cache.get('id-1');

        expect(get).toHaveBeenCalledTimes(5);
    });
});