import { Injectable, Logger } from '@nestjs/common';
import { PubsubInterface } from '../domain/pubsub.interface';
import { AnalyseRequestDto } from '../domain/dtos/analyse-request.dto';
import { TransactionStatus } from '../domain/enums/transaction-status';
import { UpdateTransactionEventDto } from '../domain/dtos/update-transaction-event.dto';
import { EventType } from '../domain/enums/event-type';

@Injectable()
export class AntifraudService {
  constructor(private readonly pubsubService: PubsubInterface) {}

  analyse(request: AnalyseRequestDto) {
    const updateRequest: UpdateTransactionEventDto = {
      type: EventType.UPDATE,
      transactionId: request.transactionId,
      transactionStatus:
        request.value > 1000
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED,
    };
    const message = JSON.stringify(updateRequest);
    Logger.log(message);
    this.pubsubService.publish(process.env.KAFKA_DB_WRITE_EVENT_TOPIC, message);
  }
}
