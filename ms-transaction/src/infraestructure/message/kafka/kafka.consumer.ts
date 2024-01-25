import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import * as retry from 'async-retry';



import { IConsumer } from 'src/helper/type.helper';
import { sleep } from 'src/helper/utils.helper';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    const produceStartTime = Date.now();
    await this.consumer.subscribe(this.topic);
    console.log('consumer suscribe', Date.now() - produceStartTime, 'ms');
/*     await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 0,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err,
          );
          await this.addMessageToDlq(message);
        }
      },
    }); */
    await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const produceStartTime = Date.now();
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
            console.log(`- ${prefix} ${message.key}#${message.value}`)
            console.log('consumer suscribex', Date.now() - produceStartTime, 'ms');
          },
      });
      console.log('consumer run2', Date.now() - produceStartTime, 'ms');
  }

  private async addMessageToDlq(message: KafkaMessage) {
    console.log(message);
/*     await this.databaseService
      .getDbHandle()
      .collection('dlq')
      .insertOne({ value: message.value, topic: this.topic.topics }); */
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