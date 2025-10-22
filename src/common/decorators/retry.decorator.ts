import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts: number;

  delay: number;

  backoffType: 'fixed' | 'exponential' | 'linear';

  maxDelay: number;

  isRetryable?: (error: Error) => boolean;

  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delay: 1000,
  backoffType: 'exponential',
  maxDelay: 30000,
  isRetryable: () => true,
};

export function Retry(options?: Partial<RetryOptions>) {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...options };

  return function (
    target: unknown,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`RetryDecorator:${(target as { constructor: { name: string } }).constructor.name}.${propertyName}`);

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;

          if (!config.isRetryable!(lastError)) {
            logger.warn(`Error is not retryable: ${lastError.message}`);
            throw lastError;
          }

          if (attempt === config.maxAttempts) {
            logger.error(
              `Max retry attempts (${config.maxAttempts}) reached. ` +
              `Final error: ${lastError.message}`
            );
            throw lastError;
          }

          const delay = calculateDelay(attempt, config);

          logger.warn(
            `Attempt ${attempt}/${config.maxAttempts} failed. ` +
            `Retrying in ${delay}ms. Error: ${lastError.message}`
          );

          if (config.onRetry) {
            config.onRetry(attempt, lastError);
          }

          await sleep(delay);
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

function calculateDelay(attempt: number, config: RetryOptions): number {
  let delay: number;

  switch (config.backoffType) {
    case 'fixed':
      delay = config.delay;
      break;
    case 'linear':
      delay = config.delay * attempt;
      break;
    case 'exponential':
      delay = config.delay * Math.pow(2, attempt - 1);
      break;
    default:
      delay = config.delay;
  }

  return Math.min(delay, config.maxDelay);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function RetryWithExponentialBackoff(maxAttempts = 3, initialDelay = 1000) {
  return Retry({
    maxAttempts,
    delay: initialDelay,
    backoffType: 'exponential',
    maxDelay: 30000,
  });
}

export function RetryWithLinearBackoff(maxAttempts = 3, delay = 1000) {
  return Retry({
    maxAttempts,
    delay,
    backoffType: 'linear',
    maxDelay: 10000,
  });
}