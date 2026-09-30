import { createHash } from 'node:crypto';
import {
    type CallHandler,
    ConflictException,
    type ExecutionContext,
    UnprocessableEntityException,
} from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';

import { IdempotencyInterceptor } from './idempotency.interceptor';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

const body = { value: 120 };
const fingerprint = createHash('sha256').update(JSON.stringify(body)).digest('hex');

const contextWith = (headers: Record<string, string>): ExecutionContext =>
    ({
        switchToHttp: () => ({
            getRequest: () => ({ header: (name: string) => headers[name.toLowerCase()], body }),
        }),
    }) as unknown as ExecutionContext;

function setup(acquireResult: unknown = null) {
    const store = {
        acquire: jest.fn().mockResolvedValue(acquireResult),
        complete: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
    };
    const interceptor = new IdempotencyInterceptor(store as unknown as IdempotencyStorePort);
    return { interceptor, store };
}

const handlerReturning = (result: ReturnType<typeof of>) =>
    ({ handle: jest.fn().mockReturnValue(result) }) as unknown as CallHandler;

describe('IdempotencyInterceptor', () => {
    it('passes through when there is no Idempotency-Key', async () => {
        const { interceptor, store } = setup();

        const result = await lastValueFrom(
            await interceptor.intercept(contextWith({}), handlerReturning(of({ id: 1 }))),
        );

        expect(result).toEqual({ id: 1 });
        expect(store.acquire).not.toHaveBeenCalled();
    });

    it('runs the handler and stores the response for a new key', async () => {
        const { interceptor, store } = setup(null);

        const result = await lastValueFrom(
            await interceptor.intercept(contextWith({ 'idempotency-key': 'k1' }), handlerReturning(of({ id: 1 }))),
        );

        expect(result).toEqual({ id: 1 });
        expect(store.complete).toHaveBeenCalledWith('k1', fingerprint, { id: 1 }, 86400);
    });

    it('replays the stored response without running the handler', async () => {
        const { interceptor } = setup({ status: 'completed', fingerprint, response: { id: 'saved' } });
        const next = handlerReturning(of({ id: 'new' }));

        const result = await lastValueFrom(
            await interceptor.intercept(contextWith({ 'idempotency-key': 'k1' }), next),
        );

        expect(result).toEqual({ id: 'saved' });
        expect(next.handle).not.toHaveBeenCalled();
    });

    it('rejects the same key with a different payload', async () => {
        const { interceptor } = setup({ status: 'completed', fingerprint: 'other', response: {} });

        await expect(
            interceptor.intercept(contextWith({ 'idempotency-key': 'k1' }), handlerReturning(of({}))),
        ).rejects.toBeInstanceOf(UnprocessableEntityException);
    });

    it('answers 409 while the first request is still in progress', async () => {
        const { interceptor } = setup({ status: 'in_progress', fingerprint });

        await expect(
            interceptor.intercept(contextWith({ 'idempotency-key': 'k1' }), handlerReturning(of({}))),
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('releases the key when the handler fails', async () => {
        const { interceptor, store } = setup(null);
        const failing = {
            handle: () => throwError(() => new Error('boom')),
        } as unknown as CallHandler;

        const stream = await interceptor.intercept(contextWith({ 'idempotency-key': 'k1' }), failing);

        await expect(lastValueFrom(stream)).rejects.toThrow('boom');
        expect(store.release).toHaveBeenCalledWith('k1');
    });
});