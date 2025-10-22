import { CircuitBreakerService } from '../patterns/circuit-breaker/circuit-breaker.service';
import { CircuitBreakerOptions } from '../patterns/circuit-breaker/circuit-breaker.config';
import { Logger } from '@nestjs/common';

const circuitBreakers = new Map<string, CircuitBreakerService>();

export function CircuitBreaker(options?: Partial<CircuitBreakerOptions>) {
  return function (
    target: unknown,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const logger = new Logger('CircuitBreakerDecorator');
    const circuitBreakerName = `${(target as { constructor: { name: string } }).constructor.name}.${propertyName}`;

    descriptor.value = async function (this: unknown, ...args: unknown[]) {
      if (!circuitBreakers.has(circuitBreakerName)) {
        circuitBreakers.set(
          circuitBreakerName,
          new CircuitBreakerService({
            ...options,
            name: circuitBreakerName,
          })
        );
      }

      const circuitBreaker = circuitBreakers.get(circuitBreakerName)!;

      try {
        return await circuitBreaker.execute(async () => {
          return originalMethod.apply(this, args);
        });
      } catch (error) {
        logger.error(
          `Circuit breaker ${circuitBreakerName} error: ${(error as Error).message}`
        );
        throw error;
      }
    };

    return descriptor;
  };
}