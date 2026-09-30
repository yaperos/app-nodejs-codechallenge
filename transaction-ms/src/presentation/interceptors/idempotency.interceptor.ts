import { createHash } from 'node:crypto';
import {
    type CallHandler,
    ConflictException,
    type ExecutionContext,
    Injectable,
    type NestInterceptor,
    UnprocessableEntityException,
} from '@nestjs/common';
import type { Request } from 'express';
import { catchError, from, mergeMap, type Observable, of, throwError } from 'rxjs';
import { IdempotencyStorePort } from '../../application/ports/idempotency-store.port';

const TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
    constructor(private readonly store: IdempotencyStorePort) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
        const request = context.switchToHttp().getRequest<Request>();
        const key = request.header('Idempotency-Key');
        if (!key) return next.handle();

        const fingerprint = createHash('sha256')
            .update(JSON.stringify(request.body ?? {}))
            .digest('hex');

        const existing = await this.store.acquire(key, fingerprint, TTL_SECONDS);
        if (existing) {
            if (existing.fingerprint !== fingerprint) {
                throw new UnprocessableEntityException(
                    'Idempotency-Key was already used with a different payload',
                );
            }
            if (existing.status === 'in_progress') {
                throw new ConflictException('A request with this Idempotency-Key is still in progress');
            }
            return of(existing.response);
        }

        return next.handle().pipe(
            mergeMap((response) =>
                from(this.store.complete(key, fingerprint, response, TTL_SECONDS)).pipe(
                    mergeMap(() => of(response)),
                ),
            ),
            catchError((error) =>
                from(this.store.release(key)).pipe(mergeMap(() => throwError(() => error))),
            ),
        );
    }
}