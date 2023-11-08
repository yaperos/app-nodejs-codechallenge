import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import * as retry from 'async-retry';
import { sleep } from '../utils/sleep';
import { IConsumer } from './consumer.interface';
//import { DatabaseService } from '../database/database.service';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    //private readonly databaseService: DatabaseService,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({topic, message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
      
       try {
          await this.addMessageToDlq(message);
        } catch (err) {
          this.logger.error(
            'Error consuming message..',
            err,
          );
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    this.logger.log("here database", message.value.toString())
   /* await this.databaseService
      .getDbHandle()
      .collection('dlq')
      .insertOne({ value: message.value, topic: this.topic.topics });*/
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}