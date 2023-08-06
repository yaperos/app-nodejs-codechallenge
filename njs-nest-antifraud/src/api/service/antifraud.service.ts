import { KAFKA_INSTANCE_NAME } from '@api/constant/kafka.constant';
import { MessageUpdateDTO } from '@api/dto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPatternEnum } from 'src/enum/event-pattern.enum';
import { MessageStatusEnum } from 'src/enum/message-status.enum';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly clientKafka: ClientKafka,
  ) {
    Logger.log(`Kafka instance name: ${KAFKA_INSTANCE_NAME}`, 'AntiFraudService');
  }

  validateTransaction(event: MessageUpdateDTO) {
    Logger.log(
      `Received message from topic ${KAFKA_INSTANCE_NAME}: ${JSON.stringify(
        event,
      )}`,
      'AntiFraudService',
    );
    const transactionResponse = {
      id: event.id,
      status:
        Number(event.value) > 1000
          ? MessageStatusEnum.APPROVED
          : MessageStatusEnum.REJECTED,
      value: event.value,
    };

    this.clientKafka.emit(
      EventPatternEnum.TransactionUpdate,
      JSON.stringify(transactionResponse),
    );
  }
}