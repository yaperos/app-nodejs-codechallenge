import type { Redis } from 'ioredis';
import { RedisIdempotencyStore } from './redis-idempotency.store';

function setup(options: { reserved?: boolean; existing?: unknown } = {}) {
    const set = jest.fn().mockResolvedValue(options.reserved === false ? null : 'OK');
    const get = jest
        .fn()
        .mockResolvedValue(options.existing === undefined ? null : JSON.stringify(options.existing));
    const del = jest.fn().mockResolvedValue(1);
    return { store: new RedisIdempotencyStore({ set, get, del } as unknown as Redis), set, del };
}

describe('RedisIdempotencyStore', () => {
    it('reserves a new key and returns null', async () => {
        const { store, set } = setup();

        await expect(store.acquire('k1', 'fp', 60)).resolves.toBeNull();

        expect(set).toHaveBeenCalledWith(
            'idempotency:transactions:k1',
            JSON.stringify({ status: 'in_progress', fingerprint: 'fp' }),
            'EX',
            60,
            'NX',
        );
    });

    it('returns the existing record when the key is already reserved', async () => {
        const existing = { status: 'completed', fingerprint: 'fp', response: { id: 1 } };
        const { store } = setup({ reserved: false, existing });

        await expect(store.acquire('k1', 'fp', 60)).resolves.toEqual(existing);
    });

    it('stores the completed response', async () => {
        const { store, set } = setup();

        await store.complete('k1', 'fp', { id: 1 }, 60);

        expect(set).toHaveBeenCalledWith(
            'idempotency:transactions:k1',
            JSON.stringify({ status: 'completed', fingerprint: 'fp', response: { id: 1 } }),
            'EX',
            60,
        );
    });

    it('releases the key', async () => {
        const { store, del } = setup();
        await store.release('k1');
        expect(del).toHaveBeenCalledWith('idempotency:transactions:k1');
    });
});