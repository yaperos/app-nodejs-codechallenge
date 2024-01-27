import { Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
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