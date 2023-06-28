import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionCreated, TransactionStatuses } from './domain/transaction';
import { MAXIMUN_VALUE_TO_REJECT } from './shared/globals';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA')
    private readonly kafkaService: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  validateTransaction(transactionCreated: TransactionCreated) {
    const payload: TransactionCreated = {
      ...transactionCreated,
      transactionStatus: {
        name: transactionCreated.transactionValue > MAXIMUN_VALUE_TO_REJECT ? TransactionStatuses.Rejected : TransactionStatuses.Approved
      }
    }
    this.kafkaService.emit(this.configService.get('KAFKA_TOPIC_TRANSACTION_VERIFIED'), payload);
    Logger.log('EVENTO EMITIDO KAFKA_TOPIC_TRANSACTION_VERIFIED')
  }

}
