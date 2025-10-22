import { Injectable, Logger } from '@nestjs/common';
import {
  CircuitBreakerOptions,
  CircuitState,
  CircuitBreakerMetrics,
  DEFAULT_CIRCUIT_BREAKER_OPTIONS,
} from './circuit-breaker.config';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private state: CircuitState = CircuitState.CLOSED;
  private failures = 0;
  private successes = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private halfOpenRequests = 0;
  private totalRequests = 0;
  private rejectedRequests = 0;
  private readonly failureTimestamps: Date[] = [];
  private readonly options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions>) {
    this.options = {
      ...DEFAULT_CIRCUIT_BREAKER_OPTIONS,
      ...options,
    } as CircuitBreakerOptions;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++;

    this.checkStateTransition();

    if (this.state === CircuitState.OPEN) {
      this.rejectedRequests++;
      this.logger.warn(
        `Circuit breaker is OPEN for ${this.options.name}. Request rejected.`
      );

      if (this.options.fallback) {
        return this.options.fallback() as T;
      }

      throw new Error(`Circuit breaker is OPEN for ${this.options.name}`);
    }

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.halfOpenRequests >= this.options.halfOpenRequestsAllowed) {
        this.rejectedRequests++;
        this.logger.warn(
          `Circuit breaker is HALF_OPEN for ${this.options.name}. Max requests reached.`
        );

        if (this.options.fallback) {
          return this.options.fallback() as T;
        }

        throw new Error(`Circuit breaker is HALF_OPEN for ${this.options.name}`);
      }
      this.halfOpenRequests++;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error as Error);
      throw error;
    }
  }

  private onSuccess(): void {
    this.lastSuccessTime = new Date();
    this.successes++;

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successes >= this.options.successThreshold) {
        this.close();
      }
    }

    if (this.state === CircuitState.CLOSED) {
      this.failures = 0;
      this.failureTimestamps.length = 0;
    }
  }

  private onFailure(error: Error): void {
    if (this.options.errorFilter && !this.options.errorFilter(error)) {
      return;
    }

    this.lastFailureTime = new Date();
    this.failures++;
    this.failureTimestamps.push(new Date());

    const windowStart = new Date(Date.now() - this.options.rollingWindow);
    const recentFailures = this.failureTimestamps.filter(
      timestamp => timestamp > windowStart
    );
    this.failureTimestamps.length = 0;
    this.failureTimestamps.push(...recentFailures);

    if (this.state === CircuitState.HALF_OPEN) {
      this.open();
      return;
    }

    if (this.state === CircuitState.CLOSED) {
      if (recentFailures.length >= this.options.failureThreshold) {
        this.open();
      }
    }
  }

  private open(): void {
    this.state = CircuitState.OPEN;
    this.successes = 0;
    this.logger.error(
      `Circuit breaker opened for ${this.options.name}. ` +
      `Failures: ${this.failures}/${this.options.failureThreshold}`
    );
  }

  private close(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.halfOpenRequests = 0;
    this.failureTimestamps.length = 0;
    this.logger.log(`Circuit breaker closed for ${this.options.name}`);
  }

  private halfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.successes = 0;
    this.halfOpenRequests = 0;
    this.logger.log(`Circuit breaker half-open for ${this.options.name}`);
  }

  private checkStateTransition(): void {
    if (this.state === CircuitState.OPEN && this.lastFailureTime) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime.getTime();
      if (timeSinceLastFailure >= this.options.timeout) {
        this.halfOpen();
      }
    }
  }

  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      rejectedRequests: this.rejectedRequests,
    };
  }

  reset(): void {
    this.close();
    this.totalRequests = 0;
    this.rejectedRequests = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
  }

  getState(): CircuitState {
    return this.state;
  }

  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  isClosed(): boolean {
    return this.state === CircuitState.CLOSED;
  }
}