import { Logger } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { RedisProcessedMessageStore } from './redis-processed-message.store';

function setup(overrides: Partial<Record<'exists' | 'set', jest.Mock>> = {}) {
    const redis = {
        exists: jest.fn().mockResolvedValue(0),
        set: jest.fn().mockResolvedValue('OK'),
        ...overrides,
    };
    return { store: new RedisProcessedMessageStore(redis as unknown as Redis), redis };
}

describe('RedisProcessedMessageStore', () => {
    beforeEach(() => {
        jest.spyOn(Logger.prototype, 'warn').mockImplementation();
        jest.spyOn(Logger.prototype, 'error').mockImplementation();
    });
    afterEach(() => jest.restoreAllMocks());

    it('reports whether an event was already processed', async () => {
        const seen = setup({ exists: jest.fn().mockResolvedValue(1) });
        const fresh = setup();

        await expect(seen.store.wasProcessed('evt-1')).resolves.toBe(true);
        await expect(fresh.store.wasProcessed('evt-1')).resolves.toBe(false);
    });

    it('fails open: treats the event as new when Redis is down', async () => {
        const { store } = setup({ exists: jest.fn().mockRejectedValue(new Error('redis down')) });
        await expect(store.wasProcessed('evt-1')).resolves.toBe(false);
    });

    it('marks the event with a 7 day TTL', async () => {
        const { store, redis } = setup();

        await store.markProcessed('evt-1');

        expect(redis.set).toHaveBeenCalledWith('anti-fraud:processed:evt-1', '1', 'EX', 604800);
    });

    it('does not throw when Redis is down while marking', async () => {
        const { store } = setup({ set: jest.fn().mockRejectedValue(new Error('redis down')) });
        await expect(store.markProcessed('evt-1')).resolves.toBeUndefined();
    });
});