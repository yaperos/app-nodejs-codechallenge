import { Inject, Injectable } from '@nestjs/common';
import { TransactionStatusEnum } from 'constants/antifraud';
import { ClientKafka } from '@nestjs/microservices';
import { UPDATE_TRANSACTION_STATUS } from 'constants/kafka-topics';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async validateTransaction(transactionId: string, value: number) {
    const status =
      value > 1000
        ? TransactionStatusEnum.REJECTED
        : TransactionStatusEnum.APPROVED;
    this.kafkaClient.emit(
      UPDATE_TRANSACTION_STATUS,
      JSON.stringify({ transactionId, status }),
    );
  }
}
