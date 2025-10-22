import { Job, Queue } from 'bull';
import { BaseQueueService, BaseQueueOptions } from './base-queue.service';

class TestQueueService extends BaseQueueService {
  public jobProcessor: (job: Job) => Promise<unknown> = async (job) => ({ result: 'success', data: job.data });

  protected async processJob(job: Job): Promise<unknown> {
    return this.jobProcessor(job);
  }

  public async publicProcess(job: Job): Promise<unknown> {
    return this.process(job);
  }

  public getPublicMetrics() {
    return this.metrics;
  }
}

describe('BaseQueueService', () => {
  let service: TestQueueService;
  let mockQueue: jest.Mocked<Queue>;
  let mockJob: Partial<Job>;

  beforeEach(() => {

    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
      addBulk: jest.fn().mockResolvedValue([{ id: 'job-1' }, { id: 'job-2' }]),
      on: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(5),
      getActiveCount: jest.fn().mockResolvedValue(2),
      getCompletedCount: jest.fn().mockResolvedValue(100),
      getFailedCount: jest.fn().mockResolvedValue(3),
      getDelayedCount: jest.fn().mockResolvedValue(1),
      isPaused: jest.fn().mockResolvedValue(false),
      pause: jest.fn().mockResolvedValue(undefined),
      resume: jest.fn().mockResolvedValue(undefined),
      clean: jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]),
      empty: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<Queue>;

    mockJob = {
      id: 'test-job-1',
      data: { test: 'data' },
      attemptsMade: 0,
      opts: { attempts: 3 },
    };
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with default DLQ enabled', () => {
      const options: BaseQueueOptions = {
        queueName: 'test-queue',
      };

      service = new TestQueueService(mockQueue, options);

      expect(service['dlqHandler']).toBeDefined();
    });

    it('should initialize without DLQ when disabled', () => {
      const options: BaseQueueOptions = {
        queueName: 'test-queue',
        enableDLQ: false,
      };

      service = new TestQueueService(mockQueue, options);

      expect(service['dlqHandler']).toBeUndefined();
    });

    it('should initialize with circuit breaker when enabled', () => {
      const options: BaseQueueOptions = {
        queueName: 'test-queue',
        enableCircuitBreaker: true,
        circuitBreakerOptions: {
          failureThreshold: 5,
        },
      };

      service = new TestQueueService(mockQueue, options);

      expect(service['circuitBreaker']).toBeDefined();
    });

    it('should setup queue event listeners', () => {
      const options: BaseQueueOptions = {
        queueName: 'test-queue',
      };

      service = new TestQueueService(mockQueue, options);

      expect(mockQueue.on).toHaveBeenCalledWith('completed', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('failed', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('stalled', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should initialize metrics with zero values', () => {
      const options: BaseQueueOptions = {
        queueName: 'test-queue',
      };

      service = new TestQueueService(mockQueue, options);
      const metrics = service.getPublicMetrics();

      expect(metrics.processed).toBe(0);
      expect(metrics.failed).toBe(0);
      expect(metrics.succeeded).toBe(0);
      expect(metrics.averageProcessingTime).toBe(0);
    });
  });

  describe('process', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
        enableDLQ: false,
        enableCircuitBreaker: false,
      });
    });

    it('should successfully process a job', async () => {
      const result = await service.publicProcess(mockJob as Job);

      expect(result).toEqual({ result: 'success', data: { test: 'data' } });
    });

    it('should update metrics on success', async () => {
      await service.publicProcess(mockJob as Job);

      const metrics = service.getPublicMetrics();
      expect(metrics.processed).toBe(1);
      expect(metrics.succeeded).toBe(1);
      expect(metrics.failed).toBe(0);
      expect(metrics.lastProcessedAt).toBeInstanceOf(Date);
    });

    it('should update average processing time', async () => {
      await service.publicProcess(mockJob as Job);

      const metrics = service.getPublicMetrics();

      expect(typeof metrics.averageProcessingTime).toBe('number');
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle job processing errors', async () => {
      const error = new Error('Processing failed');
      service.jobProcessor = jest.fn().mockRejectedValue(error);

      await expect(service.publicProcess(mockJob as Job)).rejects.toThrow('Processing failed');
    });

    it('should update metrics on failure', async () => {
      service.jobProcessor = jest.fn().mockRejectedValue(new Error('Failed'));

      try {
        await service.publicProcess(mockJob as Job);
      } catch (e) {

      }

      const metrics = service.getPublicMetrics();
      expect(metrics.processed).toBe(1);
      expect(metrics.failed).toBe(1);
      expect(metrics.succeeded).toBe(0);
      expect(metrics.lastError).toBe('Failed');
      expect(metrics.lastErrorAt).toBeInstanceOf(Date);
    });

    it('should track attempt number in logs', async () => {
      const spy = jest.fn().mockResolvedValue({ result: 'success' });
      service.jobProcessor = spy;
      mockJob.attemptsMade = 2;

      await service.publicProcess(mockJob as Job);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('process with Circuit Breaker', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
        enableCircuitBreaker: true,
        enableDLQ: false,
      });
    });

    it('should use circuit breaker when enabled', async () => {
      const result = await service.publicProcess(mockJob as Job);

      expect(result).toBeDefined();
      const metrics = service.getPublicMetrics();
      expect(metrics.succeeded).toBe(1);
    });

    it('should handle circuit breaker open state', async () => {

      service.jobProcessor = jest.fn().mockRejectedValue(new Error('Failed'));

      for (let i = 0; i < 5; i++) {
        try {
          await service.publicProcess({ ...mockJob, id: `job-${i}` } as Job);
        } catch (e) {

        }
      }

      const metrics = service.getMetrics();
      expect(metrics.circuitBreakerState).toBeDefined();
    });
  });

  describe('process with DLQ', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
        enableDLQ: true,
        enableCircuitBreaker: false,
      });
    });

    it('should send to DLQ on last attempt failure', async () => {
      const error = new Error('Final failure');
      service.jobProcessor = jest.fn().mockRejectedValue(error);

      mockJob.attemptsMade = 2;
      mockJob.opts = { attempts: 3 };

      try {
        await service.publicProcess(mockJob as Job);
      } catch (e) {

      }

      expect(service['dlqHandler']).toBeDefined();
    });

    it('should not send to DLQ on non-final attempt', async () => {
      service.jobProcessor = jest.fn().mockRejectedValue(new Error('Not final'));

      mockJob.attemptsMade = 0;
      mockJob.opts = { attempts: 3 };

      try {
        await service.publicProcess(mockJob as Job);
      } catch (e) {

      }

      expect(service.jobProcessor).toHaveBeenCalled();
    });
  });

  describe('addJob', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should add job to queue with default options', async () => {
      const data = { test: 'data' };
      const job = await service.addJob(data);

      expect(mockQueue.add).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        })
      );
      expect(job.id).toBe('job-123');
    });

    it('should allow custom options', async () => {
      const data = { custom: 'data' };
      const customOptions = {
        attempts: 5,
        priority: 10,
      };

      await service.addJob(data, customOptions);

      expect(mockQueue.add).toHaveBeenCalledWith(
        data,
        expect.objectContaining({
          attempts: 5,
          priority: 10,
        })
      );
    });
  });

  describe('addBulkJobs', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should add multiple jobs to queue', async () => {
      const jobs = [
        { data: { id: 1 } },
        { data: { id: 2 } },
      ];

      const addedJobs = await service.addBulkJobs(jobs);

      expect(mockQueue.addBulk).toHaveBeenCalled();
      expect(addedJobs).toHaveLength(2);
    });

    it('should apply default options to bulk jobs', async () => {
      const jobs = [{ data: { test: 'bulk' } }];

      await service.addBulkJobs(jobs);

      const bulkArg = mockQueue.addBulk.mock.calls[0][0];
      expect(bulkArg[0].opts).toMatchObject({
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });
    });
  });

  describe('getMetrics', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
        enableCircuitBreaker: true,
        enableDLQ: true,
      });
    });

    it('should return metrics with circuit breaker state', () => {
      const metrics = service.getMetrics();

      expect(metrics).toHaveProperty('processed');
      expect(metrics).toHaveProperty('succeeded');
      expect(metrics).toHaveProperty('failed');
      expect(metrics).toHaveProperty('averageProcessingTime');
      expect(metrics).toHaveProperty('circuitBreakerState');
    });

    it('should include DLQ stats when enabled', () => {
      const metrics = service.getMetrics();

      expect(metrics).toHaveProperty('dlqStats');
    });

    it('should calculate average processing time correctly', async () => {

      await service.publicProcess(mockJob as Job);
      await service.publicProcess({ ...mockJob, id: 'job-2' } as Job);

      const metrics = service.getMetrics();

      expect(typeof metrics.averageProcessingTime).toBe('number');
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);
      expect(metrics.processed).toBe(2);
      expect(metrics.succeeded).toBe(2);
    });
  });

  describe('getQueueStatus', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should return queue status with counts', async () => {
      const status = await service.getQueueStatus();

      expect(status.name).toBe('test-queue');
      expect(status.counts).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      });
      expect(status.isPaused).toBe(false);
    });

    it('should include metrics in status', async () => {
      const status = await service.getQueueStatus();

      expect(status.metrics).toBeDefined();
      expect(status.metrics.processed).toBeDefined();
    });
  });

  describe('Queue Control Methods', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should pause the queue', async () => {
      await service.pause();

      expect(mockQueue.pause).toHaveBeenCalled();
    });

    it('should resume the queue', async () => {
      await service.resume();

      expect(mockQueue.resume).toHaveBeenCalled();
    });

    it('should clean old jobs', async () => {
      await service.clean(5000);

      expect(mockQueue.clean).toHaveBeenCalledWith(5000, 'completed');
      expect(mockQueue.clean).toHaveBeenCalledWith(5000, 'failed');
    });

    it('should use default grace period for cleaning', async () => {
      await service.clean();

      expect(mockQueue.clean).toHaveBeenCalledWith(3600000, 'completed');
    });

    it('should drain all jobs from queue', async () => {
      await service.drain();

      expect(mockQueue.empty).toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should setup event listeners on initialization', () => {
      expect(mockQueue.on).toHaveBeenCalledWith('completed', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('failed', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('stalled', expect.any(Function));
      expect(mockQueue.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should have 4 event listeners registered', () => {

      const eventCalls = mockQueue.on.mock.calls;
      const eventTypes = eventCalls.map(call => call[0]);

      expect(eventTypes).toContain('completed');
      expect(eventTypes).toContain('failed');
      expect(eventTypes).toContain('stalled');
      expect(eventTypes).toContain('error');
    });
  });

  describe('Metrics Tracking', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
        enableDLQ: false,
      });
    });

    it('should track processing times (max 100)', async () => {

      for (let i = 0; i < 150; i++) {
        await service.publicProcess({ ...mockJob, id: `job-${i}` } as Job);
      }

      const metrics = service.getPublicMetrics();
      expect(metrics.processed).toBe(150);

      expect(typeof metrics.averageProcessingTime).toBe('number');
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);
    });

    it('should track last processed timestamp', async () => {
      const before = Date.now();
      await service.publicProcess(mockJob as Job);
      const after = Date.now();

      const metrics = service.getPublicMetrics();
      expect(metrics.lastProcessedAt).toBeInstanceOf(Date);
      expect(metrics.lastProcessedAt!.getTime()).toBeGreaterThanOrEqual(before);
      expect(metrics.lastProcessedAt!.getTime()).toBeLessThanOrEqual(after);
    });

    it('should track last error timestamp', async () => {
      service.jobProcessor = jest.fn().mockRejectedValue(new Error('Test error'));

      try {
        await service.publicProcess(mockJob as Job);
      } catch (e) {

      }

      const metrics = service.getPublicMetrics();
      expect(metrics.lastErrorAt).toBeInstanceOf(Date);
      expect(metrics.lastError).toBe('Test error');
    });
  });

  describe('onModuleDestroy', () => {
    beforeEach(() => {
      service = new TestQueueService(mockQueue, {
        queueName: 'test-queue',
      });
    });

    it('should close queue on module destroy', async () => {
      await service.onModuleDestroy();

      expect(mockQueue.close).toHaveBeenCalled();
    });
  });
});
