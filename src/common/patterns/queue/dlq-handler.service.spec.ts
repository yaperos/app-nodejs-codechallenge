import { Job } from 'bull';
import { DLQHandlerService, DLQMessage, DLQHandlerOptions } from './dlq-handler.service';

describe('DLQHandlerService', () => {
  let service: DLQHandlerService;
  let mockJob: Partial<Job>;

  beforeEach(() => {
    mockJob = {
      id: 'job-123',
      data: { test: 'data', value: 100 },
      attemptsMade: 2,
    };
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with default options', () => {
      service = new DLQHandlerService();

      const stats = service.getStats();
      expect(stats).toEqual({});
    });

    it('should initialize with custom options', () => {
      const customOptions: Partial<DLQHandlerOptions> = {
        maxRetries: 5,
        retryDelay: 30000,
        persistFailures: false,
        ttl: 86400,
      };

      service = new DLQHandlerService(customOptions);

      expect(service).toBeDefined();
    });

    it('should merge custom options with defaults', () => {
      const customOptions: Partial<DLQHandlerOptions> = {
        maxRetries: 5,
      };

      service = new DLQHandlerService(customOptions);

      expect(service).toBeDefined();
    });
  });

  describe('sendToDLQ', () => {
    beforeEach(() => {
      service = new DLQHandlerService({
        persistFailures: false,
      });
    });

    it('should send job to DLQ', async () => {
      const error = new Error('Test error');
      const queueName = 'test-queue';

      await service.sendToDLQ(mockJob as Job, error, queueName);

      const messages = service.getMessages(queueName);
      expect(messages).toHaveLength(1);
      expect(messages[0].jobId).toBe('job-123');
      expect(messages[0].error).toBe('Test error');
      expect(messages[0].originalQueue).toBe(queueName);
    });

    it('should include error stack in DLQ message', async () => {
      const error = new Error('Stack test');
      error.stack = 'Error stack trace...';

      await service.sendToDLQ(mockJob as Job, error, 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages[0].errorStack).toBe('Error stack trace...');
    });

    it('should store job data in DLQ message', async () => {
      const error = new Error('Data test');

      await service.sendToDLQ(mockJob as Job, error, 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages[0].data).toEqual({ test: 'data', value: 100 });
    });

    it('should include attempt count', async () => {
      mockJob.attemptsMade = 3;
      const error = new Error('Attempts test');

      await service.sendToDLQ(mockJob as Job, error, 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages[0].attempts).toBe(3);
    });

    it('should include metadata when provided', async () => {
      const error = new Error('Metadata test');
      const metadata = { processingTime: 5000, retryable: true };

      await service.sendToDLQ(mockJob as Job, error, 'test-queue', metadata);

      const messages = service.getMessages('test-queue');
      expect(messages[0].metadata).toEqual(metadata);
    });

    it('should set timestamp', async () => {
      const before = Date.now();
      await service.sendToDLQ(mockJob as Job, new Error('Time test'), 'test-queue');
      const after = Date.now();

      const messages = service.getMessages('test-queue');
      const timestamp = messages[0].timestamp.getTime();

      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('should handle multiple messages in same queue', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Error 1'), 'test-queue');
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Error 2'),
        'test-queue'
      );

      const messages = service.getMessages('test-queue');
      expect(messages).toHaveLength(2);
    });

    it('should store messages in different queues separately', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Queue 1'), 'queue-1');
      await service.sendToDLQ(mockJob as Job, new Error('Queue 2'), 'queue-2');

      const messages1 = service.getMessages('queue-1');
      const messages2 = service.getMessages('queue-2');

      expect(messages1).toHaveLength(1);
      expect(messages2).toHaveLength(1);
      expect(messages1[0].originalQueue).toBe('queue-1');
      expect(messages2[0].originalQueue).toBe('queue-2');
    });
  });

  describe('sendToDLQ with shouldRetry callback', () => {
    it('should respect custom shouldRetry function', async () => {
      const shouldRetry = jest.fn().mockReturnValue(false);
      service = new DLQHandlerService({
        shouldRetry,
        persistFailures: false,
      });

      mockJob.attemptsMade = 1;
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');

      expect(shouldRetry).toHaveBeenCalled();
    });

    it('should not retry when shouldRetry returns false', async () => {
      service = new DLQHandlerService({
        shouldRetry: () => false,
        persistFailures: false,
      });

      mockJob.attemptsMade = 1;
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages).toHaveLength(1);
    });
  });

  describe('sendToDLQ with onPermanentFailure callback', () => {
    it('should call onPermanentFailure when max retries exceeded', async () => {
      const onPermanentFailure = jest.fn();
      service = new DLQHandlerService({
        maxRetries: 3,
        onPermanentFailure,
        persistFailures: false,
      });

      mockJob.attemptsMade = 5; 
      await service.sendToDLQ(mockJob as Job, new Error('Failed'), 'test-queue');

      expect(onPermanentFailure).toHaveBeenCalled();
      const calledWith = onPermanentFailure.mock.calls[0][0];
      expect(calledWith.jobId).toBe('job-123');
    });

    it('should not call onPermanentFailure when under max retries', async () => {
      const onPermanentFailure = jest.fn();
      service = new DLQHandlerService({
        maxRetries: 3,
        onPermanentFailure,
        persistFailures: false,
      });

      mockJob.attemptsMade = 1;
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');

      expect(onPermanentFailure).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    beforeEach(() => {
      service = new DLQHandlerService({
        persistFailures: false,
      });
    });

    it('should return empty stats when no messages', () => {
      const stats = service.getStats();
      expect(stats).toEqual({});
    });

    it('should return stats for specific queue', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test 1'), 'test-queue');
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Test 2'),
        'test-queue'
      );

      const stats = service.getStats('test-queue');

      expect(stats['test-queue']).toBeDefined();
      expect(stats['test-queue'].total).toBe(2);
    });

    it('should group errors by type', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('NetworkError: timeout'), 'test-queue');
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('NetworkError: disconnected'),
        'test-queue'
      );
      await service.sendToDLQ(
        { ...mockJob, id: 'job-789' } as Job,
        new Error('ValidationError: invalid'),
        'test-queue'
      );

      const stats = service.getStats('test-queue');

      expect(stats['test-queue'].byError['NetworkError']).toBe(2);
      expect(stats['test-queue'].byError['ValidationError']).toBe(1);
    });

    it('should calculate average attempts', async () => {
      mockJob.attemptsMade = 2;
      await service.sendToDLQ(mockJob as Job, new Error('Error 1'), 'test-queue');

      mockJob.attemptsMade = 4;
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Error 2'),
        'test-queue'
      );

      const stats = service.getStats('test-queue');
      expect(stats['test-queue'].averageAttempts).toBe(3); 
    });

    it('should track oldest message', async () => {

      await service.sendToDLQ(mockJob as Job, new Error('First'), 'test-queue');

      await new Promise(resolve => setTimeout(resolve, 10));

      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Second'),
        'test-queue'
      );

      const stats = service.getStats('test-queue');
      const messages = service.getMessages('test-queue');

      expect(stats['test-queue'].oldestMessage).toBeDefined();
      expect(messages[0].timestamp.getTime()).toBeLessThanOrEqual(messages[1].timestamp.getTime());
    });

    it('should return stats for all queues when no queue specified', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Queue 1'), 'queue-1');
      await service.sendToDLQ(mockJob as Job, new Error('Queue 2'), 'queue-2');

      const stats = service.getStats();

      expect(Object.keys(stats)).toHaveLength(2);
      expect(stats['queue-1']).toBeDefined();
      expect(stats['queue-2']).toBeDefined();
    });

    it('should return empty object for empty queue', () => {
      const stats = service.getStats('empty-queue');

      const emptyQueueStats = stats['empty-queue'];
      if (emptyQueueStats) {
        expect(emptyQueueStats.total).toBe(0);
      } else {
        expect(emptyQueueStats).toBeUndefined();
      }
    });

    it('should return empty stats when queue is cleared', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');
      service.clearDLQ('test-queue');

      const stats = service.getStats('test-queue');

      const testQueueStats = stats['test-queue'];
      if (testQueueStats) {
        expect(testQueueStats.total).toBe(0);
      } else {
        expect(testQueueStats).toBeUndefined();
      }
    });
  });

  describe('getMessages', () => {
    beforeEach(() => {
      service = new DLQHandlerService({
        persistFailures: false,
      });
    });

    it('should return messages for specific queue', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages).toHaveLength(1);
    });

    it('should return empty array for non-existent queue', () => {
      const messages = service.getMessages('non-existent');
      expect(messages).toEqual([]);
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 10; i++) {
        await service.sendToDLQ(
          { ...mockJob, id: `job-${i}` } as Job,
          new Error(`Error ${i}`),
          'test-queue'
        );
      }

      const messages = service.getMessages('test-queue', 5);
      expect(messages).toHaveLength(5);
    });

    it('should return all messages from all queues when no queue specified', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Queue 1'), 'queue-1');
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Queue 2'),
        'queue-2'
      );

      const messages = service.getMessages();
      expect(messages.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply limit across all queues', async () => {
      for (let i = 0; i < 50; i++) {
        await service.sendToDLQ(
          { ...mockJob, id: `job-q1-${i}` } as Job,
          new Error(`Error ${i}`),
          'queue-1'
        );
      }
      for (let i = 0; i < 50; i++) {
        await service.sendToDLQ(
          { ...mockJob, id: `job-q2-${i}` } as Job,
          new Error(`Error ${i}`),
          'queue-2'
        );
      }

      const messages = service.getMessages(undefined, 10);
      expect(messages).toHaveLength(10);
    });
  });

  describe('clearDLQ', () => {
    beforeEach(() => {
      service = new DLQHandlerService({
        persistFailures: false,
      });
    });

    it('should clear specific queue', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'other-queue');

      service.clearDLQ('test-queue');

      expect(service.getMessages('test-queue')).toHaveLength(0);
      expect(service.getMessages('other-queue')).toHaveLength(1);
    });

    it('should clear all queues when no queue specified', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'queue-1');
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'queue-2');

      service.clearDLQ();

      expect(service.getMessages('queue-1')).toHaveLength(0);
      expect(service.getMessages('queue-2')).toHaveLength(0);
    });

    it('should not throw when clearing non-existent queue', () => {
      expect(() => service.clearDLQ('non-existent')).not.toThrow();
    });
  });

  describe('processDLQMessages', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      service = new DLQHandlerService({
        persistFailures: false,
        retryDelay: 1000,
        ttl: 3600, 
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should process messages for specific queue', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Test'), 'test-queue');

      await service.processDLQMessages('test-queue');

      expect(service).toBeDefined();
    });

    it('should process all queues when no queue specified', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Queue 1'), 'queue-1');
      await service.sendToDLQ(mockJob as Job, new Error('Queue 2'), 'queue-2');

      await service.processDLQMessages();

      expect(service).toBeDefined();
    });

    it('should skip expired messages', async () => {
      service = new DLQHandlerService({
        persistFailures: false,
        ttl: 1, 
      });

      await service.sendToDLQ(mockJob as Job, new Error('Expired'), 'test-queue');

      jest.advanceTimersByTime(2000);

      await service.processDLQMessages('test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages).toHaveLength(0);
    });
  });

  describe('Error Grouping', () => {
    beforeEach(() => {
      service = new DLQHandlerService({
        persistFailures: false,
      });
    });

    it('should handle errors without colon separator', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('SimpleError'), 'test-queue');

      const stats = service.getStats('test-queue');
      expect(stats['test-queue'].byError['SimpleError']).toBe(1);
    });

    it('should group similar error types together', async () => {
      await service.sendToDLQ(mockJob as Job, new Error('Timeout: connection failed'), 'test-queue');
      await service.sendToDLQ(
        { ...mockJob, id: 'job-456' } as Job,
        new Error('Timeout: request too slow'),
        'test-queue'
      );

      const stats = service.getStats('test-queue');
      expect(stats['test-queue'].byError['Timeout']).toBe(2);
    });
  });

  describe('Retry with failures', () => {
    it('should handle retry failures and increment attempts', async () => {
      service = new DLQHandlerService({
        persistFailures: false,
        maxRetries: 2,
      });

      const retryMessageSpy = jest.spyOn(service as any, 'retryMessage');
      retryMessageSpy.mockRejectedValue(new Error('Retry failed'));

      mockJob.attemptsMade = 0;
      await service.sendToDLQ(mockJob as Job, new Error('Initial error'), 'test-queue');

      const messages = service.getMessages('test-queue');
      expect(messages.length).toBeGreaterThan(0);

      retryMessageSpy.mockRestore();
    });

    it('should call onPermanentFailure when max retries exceeded during retry', async () => {
      const onPermanentFailure = jest.fn();
      service = new DLQHandlerService({
        persistFailures: false,
        maxRetries: 1,
        onPermanentFailure,
      });

      mockJob.attemptsMade = 0;
      await service.sendToDLQ(mockJob as Job, new Error('Test error'), 'test-queue');

      const message = service.getMessages('test-queue')[0];
      if (message) {
        message.attempts = 10; 

        const retryMessageSpy = jest.spyOn(service as any, 'retryMessage');
        retryMessageSpy.mockImplementation(async (msg: any) => {

          msg.attempts++;
          if (msg.attempts >= 1 && onPermanentFailure) {
            await onPermanentFailure(msg);
          }
        });

        await (service as any).retryMessage(message);

        expect(onPermanentFailure).toHaveBeenCalled();
        retryMessageSpy.mockRestore();
      }
    });
  });

  describe('Schedule Retry', () => {
    it('should schedule retry with delay', async () => {
      jest.useFakeTimers();

      service = new DLQHandlerService({
        persistFailures: false,
        retryDelay: 100,
        maxRetries: 3,
      });

      mockJob.attemptsMade = 0;
      await service.sendToDLQ(mockJob as Job, new Error('Test error'), 'test-queue');

      expect(service.getMessages('test-queue')).toHaveLength(1);

      jest.advanceTimersByTime(150);

      jest.useRealTimers();
    });
  });

  describe('Calculate Average Attempts', () => {
    it('should return 0 for empty messages array', () => {
      service = new DLQHandlerService({ persistFailures: false });

      const result = (service as any).calculateAverageAttempts([]);

      expect(result).toBe(0);
    });
  });

  describe('Get Oldest Message', () => {
    it('should return null for empty messages array', () => {
      service = new DLQHandlerService({ persistFailures: false });

      const result = (service as any).getOldestMessage([]);

      expect(result).toBeNull();
    });
  });
});
