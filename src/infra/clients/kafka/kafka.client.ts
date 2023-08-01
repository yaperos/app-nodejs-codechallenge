import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, KafkaConfig, Producer } from 'kafkajs';
import * as process from 'process';
import { KafkaPayload } from './types/kafka.type';
import {
  SUBSCRIBER_ERROR_FN_REF_MAP,
  SUBSCRIBER_FN_REF_MAP,
  SUBSCRIBER_OBJ_REF_MAP,
} from './decorators/kafka.decorator';

@Injectable()
export class KafkaClient implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private errorConsumer: Consumer;

  constructor(private kafkaConfig: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      ssl: kafkaConfig.ssl,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID,
    });
    this.errorConsumer = this.kafka.consumer({
      groupId: process.env.KAFKA_ERROR_GROUP_ID,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.connect();
    SUBSCRIBER_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToConsumer(functionRef, topic);
    });

    SUBSCRIBER_ERROR_FN_REF_MAP.forEach((functionRef, topic) => {
      // attach the function with kafka topic name
      this.bindAllTopicToErrorConsumer(functionRef, topic);
    });

    await this.errorConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_ERROR_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const functionRef = SUBSCRIBER_FN_REF_MAP.get(topic);
        const object = SUBSCRIBER_OBJ_REF_MAP.get(topic);
        // bind the subscribed functions to topic
        await functionRef.apply(object, [message.value.toString()]);
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.errorConsumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    await this.errorConsumer.disconnect();
  }

  async bindAllTopicToConsumer(callback, _topic) {
    await this.consumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  async bindAllTopicToErrorConsumer(callback, _topic) {
    await this.errorConsumer.subscribe({ topic: _topic, fromBeginning: false });
  }

  public async send(kafkaTopic: string, kafkaMessage: KafkaPayload) {
    await this.producer.connect();
    const metadata = await this.producer
      .send({
        topic: kafkaTopic,
        messages: [{ value: JSON.stringify(kafkaMessage) }],
      })
      .catch((e) => console.error(e.message, e));
    await this.producer.disconnect();
    return metadata;
  }
}
