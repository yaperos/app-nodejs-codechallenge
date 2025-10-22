import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { DLQHandlerService, DLQHandlerOptions } from './dlq-handler.service';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';
import { CircuitBreakerOptions } from '../circuit-breaker/circuit-breaker.config';

export interface BaseQueueOptions {
  queueName: string;
  dlqOptions?: Partial<DLQHandlerOptions>;
  circuitBreakerOptions?: Partial<CircuitBreakerOptions>;
  enableMetrics?: boolean;
  enableDLQ?: boolean;
  enableCircuitBreaker?: boolean;
}

export interface QueueMetrics {
  processed: number;
  failed: number;
  succeeded: number;
  averageProcessingTime: number;
  lastProcessedAt?: Date;
  lastErrorAt?: Date;
  lastError?: string;
}

export abstract class BaseQueueService implements OnModuleDestroy {
  protected readonly logger: Logger;
  protected readonly dlqHandler?: DLQHandlerService;
  protected readonly circuitBreaker?: CircuitBreakerService;
  protected readonly metrics: QueueMetrics;
  private processingTimes: number[] = [];

  constructor(
    protected readonly queue: Queue,
    protected readonly options: BaseQueueOptions
  ) {
    this.logger = new Logger(`${this.constructor.name}:${options.queueName}`);

    this.metrics = {
      processed: 0,
      failed: 0,
      succeeded: 0,
      averageProcessingTime: 0,
    };

    if (options.enableDLQ !== false) {
      this.dlqHandler = new DLQHandlerService(options.dlqOptions);
    }

    if (options.enableCircuitBreaker) {
      this.circuitBreaker = new CircuitBreakerService({
        ...options.circuitBreakerOptions,
        name: options.queueName,
      });
    }

    this.setupQueueEventListeners();
  }

  protected abstract processJob(job: Job): Promise<unknown>;

  async process(job: Job): Promise<unknown> {
    const startTime = Date.now();

    this.logger.log(
      `Processing job ${job.id} from queue ${this.options.queueName} ` +
      `(Attempt ${job.attemptsMade + 1}/${job.opts.attempts || 1})`
    );

    try {
      let result: unknown;
      if (this.circuitBreaker) {
        result = await this.circuitBreaker.execute(async () => {
          return await this.processJob(job);
        });
      } else {
        result = await this.processJob(job);
      }

      this.updateMetrics(true, startTime);

      this.logger.log(
        `Successfully processed job ${job.id} in ${Date.now() - startTime}ms`
      );

      return result;
    } catch (error) {
      const err = error as Error;

      this.updateMetrics(false, startTime, err);

      this.logger.error(
        `Failed to process job ${job.id}: ${err.message}. ` +
        `Attempt ${job.attemptsMade + 1}/${job.opts.attempts || 1}`
      );

      if (this.dlqHandler && this.isLastAttempt(job)) {
        await this.dlqHandler.sendToDLQ(job, err, this.options.queueName, {
          processingTime: Date.now() - startTime,
          circuitBreakerState: this.circuitBreaker?.getState(),
        });
      }

      throw error;
    }
  }

  async addJob<T = unknown>(data: T, options?: Record<string, unknown>): Promise<Job> {
    const job = await this.queue.add(data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      ...options,
    });

    this.logger.debug(`Added job ${job.id} to queue ${this.options.queueName}`);
    return job;
  }

  async addBulkJobs<T = unknown>(jobs: Array<{ data: T; options?: Record<string, unknown> }>): Promise<Job[]> {
    const queueJobs = jobs.map(job => ({
      data: job.data,
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
        ...job.options,
      },
    }));

    const addedJobs = await this.queue.addBulk(queueJobs);
    this.logger.debug(`Added ${addedJobs.length} jobs to queue ${this.options.queueName}`);
    return addedJobs;
  }

  private setupQueueEventListeners(): void {
    this.queue.on('completed', (job: Job, result: unknown) => {
      this.onJobCompleted(job, result);
    });

    this.queue.on('failed', (job: Job, err: Error) => {
      this.onJobFailed(job, err);
    });

    this.queue.on('stalled', (job: Job) => {
      this.onJobStalled(job);
    });

    this.queue.on('error', (error: Error) => {
      this.logger.error(`Queue error: ${error.message}`, error.stack);
    });
  }

  protected onJobCompleted(job: Job, result: unknown): void {
    this.logger.debug(`Job ${job.id} completed successfully`);
  }

  protected onJobFailed(job: Job, err: Error): void {
    this.logger.error(`Job ${job.id} failed: ${err.message}`);
  }

  protected onJobStalled(job: Job): void {
    this.logger.warn(`Job ${job.id} stalled and will be retried`);
  }

  private isLastAttempt(job: Job): boolean {
    const maxAttempts = job.opts.attempts || 1;
    return job.attemptsMade >= maxAttempts - 1;
  }

  private updateMetrics(success: boolean, startTime: number, error?: Error): void {
    const processingTime = Date.now() - startTime;

    this.metrics.processed++;

    if (success) {
      this.metrics.succeeded++;
      this.metrics.lastProcessedAt = new Date();
    } else {
      this.metrics.failed++;
      this.metrics.lastErrorAt = new Date();
      if (error) {
        this.metrics.lastError = error.message;
      }
    }

    this.processingTimes.push(processingTime);
    if (this.processingTimes.length > 100) {
      this.processingTimes.shift();
    }
    this.metrics.averageProcessingTime =
      this.processingTimes.reduce((a, b) => a + b, 0) / this.processingTimes.length;
  }

  getMetrics(): QueueMetrics & { circuitBreakerState?: string; dlqStats?: Record<string, unknown> } {
    return {
      ...this.metrics,
      circuitBreakerState: this.circuitBreaker?.getState(),
      dlqStats: this.dlqHandler?.getStats(this.options.queueName),
    };
  }

  async getQueueStatus(): Promise<{
    name: string;
    counts: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    };
    metrics: ReturnType<typeof this.getMetrics>;
    isPaused: boolean;
  }> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      name: this.options.queueName,
      counts: {
        waiting,
        active,
        completed,
        failed,
        delayed,
      },
      metrics: this.getMetrics(),
      isPaused: await this.queue.isPaused(),
    };
  }

  async pause(): Promise<void> {
    await this.queue.pause();
    this.logger.log(`Queue ${this.options.queueName} paused`);
  }

  async resume(): Promise<void> {
    await this.queue.resume();
    this.logger.log(`Queue ${this.options.queueName} resumed`);
  }

  async clean(grace: number = 3600000): Promise<void> {
    const cleaned = await Promise.all([
      this.queue.clean(grace, 'completed'),
      this.queue.clean(grace, 'failed'),
    ]);

    const total = cleaned.reduce((sum, jobs) => sum + jobs.length, 0);
    this.logger.log(`Cleaned ${total} old jobs from queue ${this.options.queueName}`);
  }

  async drain(): Promise<void> {
    await this.queue.empty();
    this.logger.warn(`Drained all jobs from queue ${this.options.queueName}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue.close();
    this.logger.log(`Queue ${this.options.queueName} closed`);
  }
}