import { Logger } from '@nestjs/common';
import {
    type CircuitBreakerPolicy,
    circuitBreaker,
    ConsecutiveBreaker,
    handleAll,
} from 'cockatiel';

export interface CircuitBreakerOptions {
    name: string;
    failureThreshold: number;
    halfOpenAfterMs: number;
}

export function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreakerPolicy {
    const logger = new Logger(`CircuitBreaker:${options.name}`);
    const breaker = circuitBreaker(handleAll, {
        halfOpenAfter: options.halfOpenAfterMs,
        breaker: new ConsecutiveBreaker(options.failureThreshold),
    });

    breaker.onBreak(() =>
        logger.error(`OPEN after ${options.failureThreshold} consecutive failures`),
    );
    breaker.onHalfOpen(() => logger.warn('HALF-OPEN: probing'));
    breaker.onReset(() => logger.log('CLOSED'));

    return breaker;
}