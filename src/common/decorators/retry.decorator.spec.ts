import { Retry, RetryWithExponentialBackoff, RetryWithLinearBackoff } from './retry.decorator';

class TestService {
  callCount = 0;
  shouldFail = true;

  @Retry({
    maxAttempts: 3,
    delay: 10,
    backoffType: 'fixed',
  })
  async methodWithRetry(): Promise<string> {
    this.callCount++;
    if (this.shouldFail) {
      throw new Error('Test error');
    }
    return 'success';
  }

  @RetryWithExponentialBackoff(3, 10)
  async methodWithExponentialBackoff(): Promise<string> {
    this.callCount++;
    if (this.shouldFail) {
      throw new Error('Test error');
    }
    return 'success';
  }

  @RetryWithLinearBackoff(3, 10)
  async methodWithLinearBackoff(): Promise<string> {
    this.callCount++;
    if (this.shouldFail) {
      throw new Error('Test error');
    }
    return 'success';
  }

  @Retry({
    maxAttempts: 3,
    delay: 10,
    backoffType: 'fixed',
    isRetryable: (error) => {
      return error.message !== 'Non-retryable';
    },
  })
  async methodWithSelectiveRetry(): Promise<string> {
    this.callCount++;
    throw new Error(this.callCount === 1 ? 'Non-retryable' : 'Test error');
  }
}

describe('Retry Decorator', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
    service.callCount = 0;
    service.shouldFail = true;
  });

  describe('Basic retry', () => {
    it('should retry failed methods', async () => {
      await expect(service.methodWithRetry()).rejects.toThrow('Test error');
      expect(service.callCount).toBe(3); 
    });

    it('should succeed if method eventually succeeds', async () => {
      setTimeout(() => {
        service.shouldFail = false;
      }, 15); 

      const result = await service.methodWithRetry();
      expect(result).toBe('success');
      expect(service.callCount).toBeGreaterThan(1);
    });

    it('should not retry if first attempt succeeds', async () => {
      service.shouldFail = false;
      const result = await service.methodWithRetry();

      expect(result).toBe('success');
      expect(service.callCount).toBe(1);
    });
  });

  describe('Exponential backoff', () => {
    it('should retry with exponential backoff', async () => {
      const startTime = Date.now();

      try {
        await service.methodWithExponentialBackoff();
      } catch (error) {

      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(service.callCount).toBe(3);

      expect(duration).toBeGreaterThanOrEqual(25);
    });
  });

  describe('Linear backoff', () => {
    it('should retry with linear backoff', async () => {
      const startTime = Date.now();

      try {
        await service.methodWithLinearBackoff();
      } catch (error) {

      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(service.callCount).toBe(3);

      expect(duration).toBeGreaterThanOrEqual(25);
    });
  });

  describe('Selective retry', () => {
    it('should not retry non-retryable errors', async () => {
      service.shouldFail = true;

      await expect(service.methodWithSelectiveRetry()).rejects.toThrow('Non-retryable');
      expect(service.callCount).toBe(1); 
    });
  });

  describe('Callback', () => {
    it('should call onRetry callback', async () => {
      const onRetry = jest.fn();

      class CallbackService {
        callCount = 0;

        @Retry({
          maxAttempts: 3,
          delay: 10,
          backoffType: 'fixed',
          onRetry,
        })
        async method(): Promise<string> {
          this.callCount++;
          throw new Error('Test error');
        }
      }

      const callbackService = new CallbackService();

      try {
        await callbackService.method();
      } catch (error) {

      }

      expect(onRetry).toHaveBeenCalledTimes(2); 
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
      expect(onRetry).toHaveBeenCalledWith(2, expect.any(Error));
    });

    it('should work without onRetry callback', async () => {
      class NoCallbackService {
        callCount = 0;

        @Retry({
          maxAttempts: 2,
          delay: 5,
          backoffType: 'fixed',
        })
        async method(): Promise<string> {
          this.callCount++;
          throw new Error('Test error');
        }
      }

      const noCallbackService = new NoCallbackService();

      await expect(noCallbackService.method()).rejects.toThrow('Test error');
      expect(noCallbackService.callCount).toBe(2);
    });
  });

  describe('Max delay', () => {
    it('should cap delay at maxDelay', async () => {
      class MaxDelayService {
        callCount = 0;

        @Retry({
          maxAttempts: 3,
          delay: 1000,
          backoffType: 'exponential',
          maxDelay: 50, 
        })
        async method(): Promise<string> {
          this.callCount++;
          throw new Error('Test error');
        }
      }

      const maxDelayService = new MaxDelayService();
      const startTime = Date.now();

      try {
        await maxDelayService.method();
      } catch (error) {

      }

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(200);
      expect(maxDelayService.callCount).toBe(3);
    });
  });

  describe('Default backoff type', () => {
    it('should handle invalid backoff type as fixed delay', async () => {
      class InvalidBackoffService {
        callCount = 0;

        @Retry({
          maxAttempts: 2,
          delay: 10,
          backoffType: 'invalid' as 'fixed',
        })
        async method(): Promise<string> {
          this.callCount++;
          throw new Error('Test error');
        }
      }

      const invalidService = new InvalidBackoffService();

      try {
        await invalidService.method();
      } catch (error) {

      }

      expect(invalidService.callCount).toBe(2);
    });
  });
});
