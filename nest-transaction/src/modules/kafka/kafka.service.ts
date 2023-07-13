import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { KAFKA_INSTANCE_NAME } from '../../app/kafka';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(KAFKA_INSTANCE_NAME)
    private readonly kafka: ClientKafka,
  ) {}

  async sendMesage(topic: string, message: any) {
    await this.kafka.emit(topic, JSON.stringify(message)).toPromise();
  }
}
