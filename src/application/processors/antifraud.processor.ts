import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { Logger, Inject } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { AntifraudService } from '../services/antifraud.service';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { BaseQueueService } from '../../common/patterns/queue/base-queue.service';
import { CircuitBreaker } from '../../common/decorators/circuit-breaker.decorator';
import { Retry } from '../../common/decorators/retry.decorator';

@Processor('antifraud')
export class AntifraudProcessor extends BaseQueueService {
  constructor(
    @InjectQueue('antifraud')
    queue: Queue,
    private readonly antifraudService: AntifraudService,
    @InjectQueue('transactions')
    private readonly transactionQueue: Queue,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {
    super(queue, {
      queueName: 'antifraud',
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
    const { transactionId } = job.data;

    this.logger.log(`Processing antifraud check for transaction ${transactionId}`);

    const result = await this.antifraudService.checkTransaction(transactionId);

    this.logger.log(
      `Antifraud check completed for ${transactionId}: ${
        result.approved ? 'APPROVED' : 'REJECTED'
      } (Score: ${result.score})`,
    );

    return {
      success: true,
      transactionId,
      result,
      processedAt: new Date().toISOString(),
    };
  }

  @Process({ name: 'check-transaction', concurrency: 20 })
  async handleAntifraudCheck(job: Job) {
    return this.process(job);
  }

  @Process({ name: 'process-approved-transaction', concurrency: 20 })
  async handleProcessApprovedTransaction(job: Job) {
    const { transactionId, antifraudScore } = job.data;

    this.logger.log(
      `Processing approved transaction ${transactionId} with antifraud score ${antifraudScore}`,
    );

    const transaction = await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    if (transaction.antifraudStatus !== 'APPROVED') {
      throw new Error(
        `Transaction ${transactionId} is not approved by antifraud (status: ${transaction.antifraudStatus})`
      );
    }

    await this.transactionQueue.add('process-transaction', {
      transactionId: transaction.id,
      antifraudApproved: true,
      antifraudScore,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 500,
      },
    });

    this.logger.log(`Transaction ${transactionId} sent to payment processing`);

    return {
      success: true,
      transactionId,
      antifraudScore,
      sentToProcessing: true,
      processedAt: new Date().toISOString(),
    };
  }
}