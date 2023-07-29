import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Kafka } from '../constants/kafka.enum';
import { TransactionMessage } from '../entities/transaction.message';

@Injectable()
export class KafkaService {
  constructor(
    @Inject(Kafka.INSTANCE_NAME)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    /*[KAFKA_TOPIC_ANTIFRAUD_VALIDATION].forEach((topic) => {
      this.kafka.subscribeToResponseOf(topic);
    });*/
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  async sendTransactionStatus(message: TransactionMessage): Promise<any> {
    this.kafka
    return this.kafka
      .emit(Kafka.TOPIC_TRANSACTION_CREATED, JSON.stringify(message));
  }
}
