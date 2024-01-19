import {
  Controller,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Payload } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { Consumer, ConsumerSubscribeTopics, Kafka } from 'kafkajs';
import {
  KAFKA_TRANSACTION_CONFIG_KEY,
  KafkaTransactionConfig,
} from 'src/config/services/kafka/kafka-transaction.config';
import { TransactionCreatedEvent } from 'src/modules/transaction/domain/transaction-created.event';

import { TransactionCreatedEventDto } from '../dto/transaction-created-event.dto';

interface TopicHandlerFunction {
  (event: any): Promise<void>;
}

@Controller()
export class TransactionEventsController
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(TransactionEventsController.name);
  private readonly topicHandlerMap: Map<string, TopicHandlerFunction>;
  private readonly kafkaConfig: KafkaTransactionConfig;
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly consumerSubscribeTopics: ConsumerSubscribeTopics;

  constructor(
    private readonly config: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    this.kafkaConfig = this.config.get<KafkaTransactionConfig>(
      KAFKA_TRANSACTION_CONFIG_KEY,
    );
    this.topicHandlerMap = new Map<string, TopicHandlerFunction>([
      [TransactionCreatedEvent.EVENT_NAME, this.handleTransactionCreated],
    ]);
    this.consumerSubscribeTopics = {
      topics: Array.from(this.topicHandlerMap.keys()),
      fromBeginning: true,
    };
  }

  async onModuleInit() {
    this.kafka = new Kafka({
      brokers: this.kafkaConfig.brokers,
      logLevel: this.kafkaConfig.logLevelConfig,
    });
    this.consumer = this.kafka.consumer({ groupId: this.kafkaConfig.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe(this.consumerSubscribeTopics);
    await this.consumer.run({
      eachMessage: this.handleKafkaMessage.bind(this),
    });
    this.logger.log('Consumer ready');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private handleKafkaMessage({ topic, partition, message }: any) {
    try {
      this.logger.log(
        `Message received: Topic - ${topic}, Partition - ${partition}, Offset - ${message.offset}`,
      );
      const topicHandlerFunction = this.topicHandlerMap.get(topic);
      if (!topicHandlerFunction) {
        throw new Error(`No handler function found for topic: ${topic}`);
      }
      const data = JSON.parse(message.value.toString());
      topicHandlerFunction.bind(this)(data);
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }

  private async handleTransactionCreated(@Payload() event: any) {
    try {
      const transactionCreatedEvent = plainToClass(
        TransactionCreatedEventDto,
        event,
      );
      this.eventBus.publish(
        TransactionCreatedEvent.fromPrimitives(transactionCreatedEvent),
      );
    } catch (error) {
      this.logger.error(error.message, error.stack, event);
    }
  }
}
