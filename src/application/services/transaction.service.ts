import { Injectable, Inject, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEventService } from './transaction-event.service';
import { CircuitBreaker } from '../../common/decorators/circuit-breaker.decorator';
import { Retry } from '../../common/decorators/retry.decorator';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @InjectQueue('transactions')
    private readonly transactionQueue: Queue,
    @InjectQueue('antifraud')
    private readonly antifraudQueue: Queue,
    private readonly transactionEventService: TransactionEventService,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    this.logger.log(`Creating transaction with amount ${dto.amount} ${dto.currency}`);

    if (dto.idempotencyKey) {
      const existing = await this.transactionRepository.findByIdempotencyKey(dto.idempotencyKey);
      if (existing) {
        this.logger.log(`Transaction with idempotency key ${dto.idempotencyKey} already exists`);
        return existing;
      }
    }

    const transaction = new Transaction({
      externalId: dto.externalId || uuidv4(),
      type: dto.type || TransactionType.P2P,
      amount: dto.amount,
      currency: dto.currency || 'PEN',
      sourceAccountId: dto.sourceAccountId,
      targetAccountId: dto.targetAccountId,
      status: TransactionStatus.PENDING,
      metadata: dto.metadata || {},
      idempotencyKey: dto.idempotencyKey,
    });

    const saved = await this.transactionRepository.save(transaction);

    await this.transactionEventService.publishTransactionCreated(
      saved.id,
      saved.externalId,
      saved.type,
      saved.amount,
      saved.currency,
      saved.sourceAccountId,
      saved.targetAccountId,
      saved.metadata,
    );

    await this.antifraudQueue.add('check-transaction', {
      transactionId: saved.id,
      timestamp: new Date().toISOString(),
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    this.logger.log(`Transaction ${saved.id} created successfully`);
    return saved;
  }

  async processApprovedTransaction(transactionId: string): Promise<Transaction> {
    this.logger.log(`Processing approved transaction ${transactionId}`);

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    if (transaction.antifraudStatus !== 'APPROVED') {
      throw new ConflictException(
        `Transaction ${transactionId} has not been approved by antifraud (status: ${transaction.antifraudStatus})`
      );
    }

    await this.transactionQueue.add('process-transaction', {
      transactionId: transaction.id,
      antifraudApproved: true,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });

    return transaction;
  }

  @CircuitBreaker({
    failureThreshold: 5,
    timeout: 30000,
    halfOpenRequestsAllowed: 3,
  })
  @Retry({
    maxAttempts: 3,
    delay: 1000,
    backoffType: 'exponential',
    isRetryable: (error) => {
      return !(error instanceof NotFoundException || error instanceof ConflictException);
    },
  })
  async processTransaction(transactionId: string): Promise<Transaction> {
    this.logger.log(`Processing transaction ${transactionId}`);

    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    if (transaction.antifraudStatus !== 'APPROVED') {
      throw new ConflictException(
        `Transaction ${transactionId} cannot be processed without antifraud approval`
      );
    }

    if (!transaction.canProcess()) {
      throw new ConflictException(`Transaction ${transactionId} cannot be processed in status ${transaction.status}`);
    }

    try {
      transaction.markAsProcessing();
      await this.transactionRepository.update(transaction);

      await this.transactionEventService.publishTransactionProcessing(transaction.id);

      await this.simulatePaymentProcessing(transaction);

      transaction.markAsCompleted();
      const completed = await this.transactionRepository.update(transaction);

      await this.transactionEventService.publishTransactionCompleted(
        transaction.id,
        new Date(),
      );

      this.logger.log(`Transaction ${transactionId} completed successfully`);
      return completed;

    } catch (error) {
      this.logger.error(`Failed to process transaction ${transactionId}`, error);

      transaction.markAsFailed(error.message);
      await this.transactionRepository.update(transaction);

      await this.transactionEventService.publishTransactionFailed(
        transaction.id,
        error.message,
      );

      throw error;
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  async getTransactionByExternalId(externalId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByExternalId(externalId);
    if (!transaction) {
      throw new NotFoundException(`Transaction with external ID ${externalId} not found`);
    }
    return transaction;
  }

  async getTransactionsByAccountId(
    accountId: string,
    limit: number = 100,
    offset: number = 0,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByAccountId(accountId, limit, offset);
  }

  async getTransactionsByStatus(
    status: TransactionStatus,
    limit: number = 100,
  ): Promise<Transaction[]> {
    return this.transactionRepository.findByStatus(status, limit);
  }

  async reverseTransaction(transactionId: string, reason?: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    if (!transaction.canReverse()) {
      throw new ConflictException(`Transaction ${transactionId} cannot be reversed`);
    }

    const reversalTransaction = new Transaction({
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      sourceAccountId: transaction.targetAccountId,
      targetAccountId: transaction.sourceAccountId,
      status: TransactionStatus.PENDING,
      metadata: {
        ...transaction.metadata,
        reversalReason: reason || 'Reversal requested',
        originalTransactionId: transactionId,
      },
    });

    const savedReversal = await this.transactionRepository.save(reversalTransaction);

    transaction.markAsReversed(savedReversal.id);
    await this.transactionRepository.update(transaction);

    await this.transactionQueue.add('process-transaction', {
      transactionId: savedReversal.id,
    });

    this.logger.log(`Transaction ${transactionId} reversed with new transaction ${savedReversal.id}`);
    return savedReversal;
  }

  async retryFailedTransactions(): Promise<number> {
    const failedTransactions = await this.transactionRepository.findFailedTransactionsForRetry(10);

    for (const transaction of failedTransactions) {
      if (transaction.canRetry()) {
        transaction.incrementRetry();
        await this.transactionRepository.update(transaction);

        await this.transactionQueue.add('process-transaction', {
          transactionId: transaction.id,
          retry: true,
        });
      }
    }

    this.logger.log(`Retrying ${failedTransactions.length} failed transactions`);
    return failedTransactions.length;
  }

  async getStatistics(startDate?: Date, endDate?: Date) {
    const [pending, processing, completed, failed] = await Promise.all([
      this.transactionRepository.countByStatus(TransactionStatus.PENDING, startDate, endDate),
      this.transactionRepository.countByStatus(TransactionStatus.PROCESSING, startDate, endDate),
      this.transactionRepository.countByStatus(TransactionStatus.COMPLETED, startDate, endDate),
      this.transactionRepository.countByStatus(TransactionStatus.FAILED, startDate, endDate),
    ]);

    const [totalCompleted, totalFailed] = await Promise.all([
      this.transactionRepository.getTotalAmountByStatus(TransactionStatus.COMPLETED, startDate, endDate),
      this.transactionRepository.getTotalAmountByStatus(TransactionStatus.FAILED, startDate, endDate),
    ]);

    return {
      counts: {
        pending,
        processing,
        completed,
        failed,
        total: pending + processing + completed + failed,
      },
      amounts: {
        completed: totalCompleted,
        failed: totalFailed,
      },
      period: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    };
  }

  private async simulatePaymentProcessing(transaction: Transaction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    if (Math.random() < 0.1) {
      throw new Error('Payment processing failed: Insufficient funds');
    }
  }
}