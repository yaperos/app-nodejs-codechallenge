import { Injectable } from '@nestjs/common';
import { TransactionUpdateKafkaProducer } from '../adapter/out/messaging/kafka/transaction-update-kafka.producer';
import { ConfigService } from '@nestjs/config';
import { TransactionStatus } from '../entity/transaction-status.enum';
import { Logger } from 'nestjs-pino';

@Injectable()
export class EvaluateFraudService {
  private maxAmountAllowed: number;

  constructor(
    private readonly transactionUpdateKafkaProducer: TransactionUpdateKafkaProducer,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.maxAmountAllowed =
      this.configService.get<number>('TRANSACTION_MAX_AMOUNT_ALLOWED') || 1000;
  }

  async evaluateTransaction(
    transactionId: string,
    amount: number,
  ): Promise<void> {
    const status =
      amount > this.maxAmountAllowed
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    this.logger.debug(
      {
        transactionId,
        status,
      },
      'Transaction evaluated',
    );
    await this.transactionUpdateKafkaProducer.produceTransactionUpdatedEvent(
      transactionId,
      status,
    );
  }
}
