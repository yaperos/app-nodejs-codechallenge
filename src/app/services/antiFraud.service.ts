
import { TransactionStatus } from '../../util/enum/transaction-status.enum'
import { KAFKA_TOPIC } from '../../util/enum/kafka.enum'
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventBus } from '../interface/event.bus';

@Controller()
export class AntiFraudService {
  constructor(
    @Inject('EventBus') private readonly eventBus: EventBus,
  ) {}

  @MessagePattern(KAFKA_TOPIC.VALIDATE_ANTIFRAUD)
  async handleAntifraudRequest(@Payload() payload: any) {
    let transaction = payload
    if(transaction.value > 1000){
        transaction.status = TransactionStatus.REJECTED
    } else {
        transaction.status = TransactionStatus.APPROVED
    }
    await this.eventBus.publish({
      event_name: KAFKA_TOPIC.VALIDATED_ANTIFRAUD,
      key: transaction.id.toString(),
      partition: 1,
      timestamp: transaction.createdAt.toString(),
      message: transaction
    });
  }

}
