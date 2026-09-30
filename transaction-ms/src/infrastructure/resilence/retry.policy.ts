import { ExponentialBackoff, handleWhen, retry, type RetryPolicy } from 'cockatiel';

export interface RetryOptions {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
    retryable?: (error: unknown) => boolean;
}

export function createRetryPolicy(options: RetryOptions): RetryPolicy {
    return retry(handleWhen(options.retryable ?? (() => true)), {
        maxAttempts: options.maxRetries,
        backoff: new ExponentialBackoff({
            initialDelay: options.initialDelayMs,
            maxDelay: options.maxDelayMs,
        }),
    });
}