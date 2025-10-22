import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { TransactionService } from '../services/transaction.service';
import { BaseQueueService } from '../../common/patterns/queue/base-queue.service';
import { CircuitBreaker } from '../../common/decorators/circuit-breaker.decorator';
import { Retry } from '../../common/decorators/retry.decorator';

@Processor('transactions')
export class TransactionProcessor extends BaseQueueService {
  constructor(
    @InjectQueue('transactions')
    queue: Queue,
    private readonly transactionService: TransactionService,
  ) {
    super(queue, {
      queueName: 'transactions',
      enableDLQ: true,
      enableCircuitBreaker: true,
      enableMetrics: true,
    });
  }

  @CircuitBreaker({
    failureThreshold: 5,
    timeout: 30000,
    halfOpenRequestsAllowed: 3,
  })
  @Retry({
    maxAttempts: 3,
    delay: 100,
    backoffType: 'exponential',
  })
  protected async processJob(job: Job): Promise<unknown> {
    const { transactionId, retry } = job.data;

    this.logger.log(
      `Processing transaction ${transactionId}${retry ? ' (retry)' : ''}`,
    );

    const result = await this.transactionService.processTransaction(transactionId);

    this.logger.log(`Transaction ${transactionId} processed successfully`);
    return {
      success: true,
      transactionId,
      status: result.status,
      processedAt: new Date().toISOString(),
    };
  }

  @Process({ name: 'process-transaction', concurrency: 20 })
  async handleProcessTransaction(job: Job) {
    return this.process(job);
  }
}