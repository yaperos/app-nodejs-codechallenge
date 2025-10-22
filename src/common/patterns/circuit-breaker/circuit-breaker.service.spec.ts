import { CircuitBreakerService } from './circuit-breaker.service';
import { CircuitState } from './circuit-breaker.config';

describe('CircuitBreakerService', () => {
  let circuitBreaker: CircuitBreakerService;

  beforeEach(() => {
    circuitBreaker = new CircuitBreakerService({
      name: 'test-circuit',
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 1000,
      halfOpenRequestsAllowed: 2,
    });
  });

  describe('CLOSED state', () => {
    it('should start in CLOSED state', () => {
      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
      expect(circuitBreaker.isClosed()).toBe(true);
    });

    it('should execute function successfully in CLOSED state', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await circuitBreaker.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should transition to OPEN after failure threshold', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(fn);
        } catch (error) {

        }
      }

      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
      expect(circuitBreaker.isOpen()).toBe(true);
    });
  });

  describe('OPEN state', () => {
    beforeEach(async () => {

      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(fn);
        } catch (error) {

        }
      }
    });

    it('should reject requests in OPEN state', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      await expect(circuitBreaker.execute(fn)).rejects.toThrow(
        'Circuit breaker is OPEN'
      );

      expect(fn).not.toHaveBeenCalled();
    });

    it('should use fallback when provided', async () => {
      const fallbackCircuit = new CircuitBreakerService({
        name: 'test-with-fallback',
        failureThreshold: 1,
        fallback: () => 'fallback-value',
      });

      try {
        await fallbackCircuit.execute(() => Promise.reject(new Error('fail')));
      } catch (error) {

      }

      const result = await fallbackCircuit.execute(() => Promise.resolve('ignored'));
      expect(result).toBe('fallback-value');
    });

    it('should transition to HALF_OPEN after timeout', async () => {

      await new Promise(resolve => setTimeout(resolve, 1100));

      const fn = jest.fn().mockResolvedValue('success');
      const result = await circuitBreaker.execute(fn);

      expect(result).toBe('success');
      expect(circuitBreaker.getState()).toBe(CircuitState.HALF_OPEN);
    });
  });

  describe('HALF_OPEN state', () => {
    beforeEach(async () => {

      const failFn = jest.fn().mockRejectedValue(new Error('fail'));
      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failFn);
        } catch (error) {

        }
      }

      await new Promise(resolve => setTimeout(resolve, 1100));

      await circuitBreaker.execute(() => Promise.resolve('success'));
    });

    it('should allow limited requests in HALF_OPEN state', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      await circuitBreaker.execute(fn);

      expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    });

    it('should return to OPEN if request fails in HALF_OPEN', async () => {
      const failFn = jest.fn().mockRejectedValue(new Error('fail'));

      try {
        await circuitBreaker.execute(failFn);
      } catch (error) {

      }

      expect(circuitBreaker.getState()).toBe(CircuitState.OPEN);
    });

    it('should limit requests in HALF_OPEN state', async () => {

      const fn = jest.fn().mockResolvedValue('success');

      await circuitBreaker.execute(fn);

      expect(circuitBreaker.isClosed()).toBe(true);
    });
  });

  describe('Error filtering', () => {
    it('should not count filtered errors as failures', async () => {
      class IgnoredError extends Error {}
      class CountedError extends Error {}

      const filteringCircuit = new CircuitBreakerService({
        name: 'filtering-circuit',
        failureThreshold: 2,
        errorFilter: (error) => !(error instanceof IgnoredError),
      });

      const ignoredFn = jest.fn().mockRejectedValue(new IgnoredError('ignored'));
      const countedFn = jest.fn().mockRejectedValue(new CountedError('counted'));

      try {
        await filteringCircuit.execute(ignoredFn);
      } catch (error) {

      }

      expect(filteringCircuit.isClosed()).toBe(true);

      for (let i = 0; i < 2; i++) {
        try {
          await filteringCircuit.execute(countedFn);
        } catch (error) {

        }
      }

      expect(filteringCircuit.isOpen()).toBe(true);
    });
  });

  describe('Metrics', () => {
    it('should track metrics correctly', async () => {
      const successFn = jest.fn().mockResolvedValue('success');
      const failFn = jest.fn().mockRejectedValue(new Error('fail'));

      await circuitBreaker.execute(successFn);

      try {
        await circuitBreaker.execute(failFn);
      } catch (error) {

      }

      const metrics = circuitBreaker.getMetrics();

      expect(metrics.totalRequests).toBe(2);
      expect(metrics.successes).toBe(1);
      expect(metrics.failures).toBe(1);
      expect(metrics.state).toBe(CircuitState.CLOSED);
      expect(metrics.lastSuccessTime).toBeDefined();
      expect(metrics.lastFailureTime).toBeDefined();
    });

    it('should track rejected requests', async () => {
      const failFn = jest.fn().mockRejectedValue(new Error('fail'));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failFn);
        } catch (error) {

        }
      }

      const successFn = jest.fn().mockResolvedValue('success');

      try {
        await circuitBreaker.execute(successFn);
      } catch (error) {

      }

      const metrics = circuitBreaker.getMetrics();
      expect(metrics.rejectedRequests).toBe(1);
    });
  });

  describe('Reset', () => {
    it('should reset circuit breaker to initial state', async () => {
      const failFn = jest.fn().mockRejectedValue(new Error('fail'));

      for (let i = 0; i < 3; i++) {
        try {
          await circuitBreaker.execute(failFn);
        } catch (error) {

        }
      }

      expect(circuitBreaker.isOpen()).toBe(true);

      circuitBreaker.reset();

      expect(circuitBreaker.isClosed()).toBe(true);
      const metrics = circuitBreaker.getMetrics();
      expect(metrics.totalRequests).toBe(0);
      expect(metrics.rejectedRequests).toBe(0);
      expect(metrics.failures).toBe(0);
      expect(metrics.successes).toBe(0);
    });
  });
});
