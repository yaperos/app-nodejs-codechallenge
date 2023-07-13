import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import {
  KAFKA_INSTANCE_NAME,
  KAFKA_TOPIC_NOTIFY_CREATE,
} from '../../app/kafka';
import { TransactionMessage } from '../transaction/entities/transaction.message';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    [KAFKA_TOPIC_NOTIFY_CREATE].forEach((topic) => {
      this.kafka.subscribeToResponseOf(topic);
    });
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  async sendMesage(message: TransactionMessage): Promise<any> {
    return await this.kafka
      .send(KAFKA_TOPIC_NOTIFY_CREATE, JSON.stringify(message))
      .toPromise();
  }
}
