import {
  StatusType,
  TransactionValidDto,
  UPDATE_TRANSACTION_TOPIC,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntifraudService {
  constructor(
    @Inject('TRANSACTION_KAFKA_CLIENT')
    private readonly clientKafka: ClientKafka,
  ) {}

  async validTransaction(request: TransactionValidDto): Promise<void> {
    const validTransaction = {
      id: request.id,
      transactionStatusId:
        request.value > 1000 ? StatusType.rejected : StatusType.approved,
    };

    this.clientKafka.emit(UPDATE_TRANSACTION_TOPIC, validTransaction);
  }
}
