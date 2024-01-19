import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { Payload } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { Consumer, ConsumerSubscribeTopics, Kafka } from 'kafkajs';
import {
  KAFKA_ANTIFRAUD_CONFIG_KEY,
  KafkaAntiFraudConfig,
} from 'src/config/services/kafka/kafka-anti-fraud.config';
import { TransactionApprovedEvent } from 'src/modules/transaction/domain/events/transaction-approved.event';
import { TransactionRejectedEvent } from 'src/modules/transaction/domain/events/transaction-rejected.event';

import { TransactionApprovedEventDto } from '../dtos/transaction-approved-event.dto';
import { TransactionRejectedEventDto } from '../dtos/transaction-rejected-event.dto';

interface TopicHandlerFunction {
  (event: any): Promise<void>;
}

@Controller()
export class AntiFraudEventsController
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(AntiFraudEventsController.name);
  private readonly topicHandlerMap: Map<string, TopicHandlerFunction>;
  private readonly kafkaConfig: KafkaAntiFraudConfig;
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly consumerSubscribeTopics: ConsumerSubscribeTopics;

  constructor(
    private readonly config: ConfigService,
    private readonly eventBus: EventBus,
  ) {
    this.kafkaConfig = this.config.get<KafkaAntiFraudConfig>(
      KAFKA_ANTIFRAUD_CONFIG_KEY,
    );
    this.topicHandlerMap = new Map<string, TopicHandlerFunction>([
      [TransactionApprovedEvent.EVENT_NAME, this.handleTransactionApproved],
      [TransactionRejectedEvent.EVENT_NAME, this.handleTransactionRejected],
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

  private async handleTransactionApproved(@Payload() event: any) {
    try {
      const transactionApprovedEvent = plainToClass(
        TransactionApprovedEventDto,
        event,
      );
      this.eventBus.publish(
        TransactionApprovedEvent.fromPrimitives(transactionApprovedEvent),
      );
    } catch (error) {
      this.logger.error(error.message, error.stack, event);
    }
  }

  private async handleTransactionRejected(@Payload() event: any) {
    try {
      const transactionRejectedEvent = plainToClass(
        TransactionRejectedEventDto,
        event,
      );
      this.eventBus.publish(
        TransactionRejectedEvent.fromPrimitives(transactionRejectedEvent),
      );
    } catch (error) {
      this.logger.error(error.message, error.stack, event);
    }
  }
}
