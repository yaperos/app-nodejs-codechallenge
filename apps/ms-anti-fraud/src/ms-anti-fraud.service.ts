import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionPayload,
  TransactionStatus,
} from './interfaces/transaction.interface';
import { ClientKafka } from '@nestjs/microservices';
import { transactionResolvedSchema } from './constants/anti-fraud.schema';
import { ANTI_FRAUD_RESOLVED_TOPIC } from './constants/topics';

const objectMapper = require('object-mapper');

@Injectable()
export class MsAntiFraudService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly clientKafka: ClientKafka,
  ) {}
  async validateAntiFraud(
    transactionValidate: TransactionPayload,
  ): Promise<void> {
    const transactionResolved: TransactionStatus = objectMapper(
      transactionValidate,
      transactionResolvedSchema,
    );

    this.clientKafka.emit(
      ANTI_FRAUD_RESOLVED_TOPIC,
      JSON.stringify(transactionResolved),
    );
  }
}
