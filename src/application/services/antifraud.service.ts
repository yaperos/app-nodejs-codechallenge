import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository';
import { CircuitBreaker } from '../../common/decorators/circuit-breaker.decorator';
import { Retry } from '../../common/decorators/retry.decorator';

export interface AntifraudCheckResult {
  transactionId: string;
  approved: boolean;
  score: number;
  reason?: string;
  checkedAt: Date;
}

@Injectable()
export class AntifraudService {
  private readonly logger = new Logger(AntifraudService.name);
  private readonly MAX_ALLOWED_AMOUNT = 1000;

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
    @InjectQueue('antifraud')
    private readonly antifraudQueue: Queue,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transaction.created');
    this.kafkaClient.subscribeToResponseOf('antifraud.result');
    await this.kafkaClient.connect();

    this.logger.log('Antifraud service initialized and listening to Kafka events');
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
  })
  async checkTransaction(transactionId: string): Promise<AntifraudCheckResult> {
    this.logger.log(`Starting antifraud check for transaction ${transactionId}`);

    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`);
      }

      const result = await this.performAntifraudValidation(transaction);

      await this.updateTransactionWithAntifraudResult(transaction, result);

      await this.emitAntifraudResult(result);

      this.logger.log(`Antifraud check completed for transaction ${transactionId}: ${result.approved ? 'APPROVED' : 'REJECTED'}`);
      return result;

    } catch (error) {
      this.logger.error(`Error in antifraud check for transaction ${transactionId}`, error);
      throw error;
    }
  }

  private async performAntifraudValidation(transaction: Transaction): Promise<AntifraudCheckResult> {
    const amount = Number(transaction.amount);

    let score = 0;
    const reasons: string[] = [];

    if (amount > this.MAX_ALLOWED_AMOUNT) {
      score += 100;
      reasons.push(`Amount ${amount} exceeds maximum allowed ${this.MAX_ALLOWED_AMOUNT}`);
    }

    const recentTransactions = await this.checkVelocity(transaction.sourceAccountId);
    if (recentTransactions > 5) {
      score += 30;
      reasons.push('High transaction velocity detected');
    }

    if (this.isSuspiciousPattern(transaction)) {
      score += 20;
      reasons.push('Suspicious transaction pattern');
    }

    if (this.isUnusualTime(transaction.createdAt)) {
      score += 10;
      reasons.push('Transaction at unusual hour');
    }

    const approved = score < 50;

    return {
      transactionId: transaction.id,
      approved,
      score: Math.min(score, 100),
      reason: reasons.join('; ') || 'Transaction passed all checks',
      checkedAt: new Date(),
    };
  }

  private async checkVelocity(accountId: string): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentTransactions = await this.transactionRepository.findByAccountId(accountId, 100, 0);

    return recentTransactions.filter(t =>
      new Date(t.createdAt) > fiveMinutesAgo
    ).length;
  }

  private isSuspiciousPattern(transaction: Transaction): boolean {
    const amount = Number(transaction.amount);
    if (amount === 999 || amount === 998 || amount === 1000) {
      return true;
    }

    if (transaction.sourceAccountId === transaction.targetAccountId) {
      return true;
    }

    return false;
  }

  private isUnusualTime(date: Date): boolean {
    const hour = date.getHours();
    return hour >= 2 && hour <= 5;
  }

  private async updateTransactionWithAntifraudResult(
    transaction: Transaction,
    result: AntifraudCheckResult
  ): Promise<void> {
    transaction.antifraudScore = result.score;
    transaction.antifraudStatus = result.approved ? 'APPROVED' : 'REJECTED';
    transaction.antifraudCheckedAt = result.checkedAt;

    if (result.approved) {
      transaction.status = TransactionStatus.PENDING;

      await this.antifraudQueue.add('process-approved-transaction', {
        transactionId: transaction.id,
        antifraudScore: result.score,
      }, {
        delay: 100,
      });

    } else {
      transaction.status = TransactionStatus.FAILED;
      transaction.failureReason = result.reason;
    }

    await this.transactionRepository.update(transaction);
  }

  private async emitAntifraudResult(result: AntifraudCheckResult): Promise<void> {
    const event = {
      eventType: 'antifraud.checked',
      transactionId: result.transactionId,
      approved: result.approved,
      score: result.score,
      reason: result.reason,
      timestamp: result.checkedAt.toISOString(),
    };

    this.kafkaClient.emit('antifraud.result', event);
  }

  async handleTransactionCreated(data: { transactionId: string; [key: string]: unknown }): Promise<void> {
    try {
      const { transactionId } = data;
      this.logger.log(`Received transaction.created event for ${transactionId}`);

      await this.antifraudQueue.add('check-transaction', {
        transactionId,
        timestamp: new Date().toISOString(),
      }, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      });

    } catch (error) {
      this.logger.error('Error handling transaction created event', error);
    }
  }

  async getStatistics(startDate?: Date, endDate?: Date) {
    const pendingTxs = await this.transactionRepository.findByStatus(TransactionStatus.PENDING, 1000);
    const processingTxs = await this.transactionRepository.findByStatus(TransactionStatus.PROCESSING, 100);
    const completedTxs = await this.transactionRepository.findByStatus(TransactionStatus.COMPLETED, 1000);
    const failedTxs = await this.transactionRepository.findByStatus(TransactionStatus.FAILED, 1000);

    const transactions = [...pendingTxs, ...processingTxs, ...completedTxs, ...failedTxs];

    const stats = {
      total: transactions.length,
      checked: 0,
      approved: 0,
      rejected: 0,
      averageScore: 0,
      highRiskCount: 0,
      byReason: {} as Record<string, number>,
    };

    let totalScore = 0;

    for (const transaction of transactions) {
      if (transaction.antifraudCheckedAt) {
        stats.checked++;

        if (transaction.antifraudStatus === 'APPROVED') {
          stats.approved++;
        } else if (transaction.antifraudStatus === 'REJECTED') {
          stats.rejected++;
        }

        if (transaction.antifraudScore) {
          totalScore += transaction.antifraudScore;
          if (transaction.antifraudScore > 70) {
            stats.highRiskCount++;
          }
        }

        if (transaction.failureReason) {
          const reason = transaction.failureReason.split(';')[0];
          stats.byReason[reason] = (stats.byReason[reason] || 0) + 1;
        }
      }
    }

    stats.averageScore = stats.checked > 0 ? totalScore / stats.checked : 0;

    return stats;
  }
}