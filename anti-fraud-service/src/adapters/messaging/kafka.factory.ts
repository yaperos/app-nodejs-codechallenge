import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaFactory {
  private readonly kafka: Kafka;

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('kafka.clientId', 'anti-fraud-service'),
      brokers: this.configService.get<string[]>('kafka.brokers') ?? ['localhost:9092'],
    });
  }

  createProducer(): Producer {
    return this.kafka.producer({ allowAutoTopicCreation: false });
  }

  createConsumer(groupId?: string): Consumer {
    return this.kafka.consumer({
      groupId:
        groupId ?? this.configService.get<string>('kafka.groupId', 'anti-fraud-service-consumer'),
    });
  }
}
