import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { KAFKA_TOPICS } from '@/enums/kafka-topics.enum';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'yape-code-challenge',
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });
  }

  /**
   * Initializes a Kafka producer and consumer.
   * @param {string} groupId - The group ID for the consumer.
   * @returns {{ consumer: Consumer, producer: Producer }} An object containing both the consumer and producer.
   */
  initializeProducerAndConsumer(groupId: string): {
    consumer: Consumer;
    producer: Producer;
  } {
    const consumer = this.kafka.consumer({ groupId });
    const producer = this.kafka.producer();
    this.logger.log(`Consumer created (groupId=${groupId}). Producer created.`);
    return { consumer, producer };
  }

  /**
   * Emits a new event for kafka
   * @param {Producer} producer - Producer for your topic
   * @param {String} topic - Topic name
   * @param {String} message - New message for the topic
   */
  async emit(producer: Producer, topic: KAFKA_TOPICS, message: object) {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    this.logger.log(
      `Message (${JSON.stringify(message)}) sent to topic: ${topic} succesfully.`,
    );
  }

  /**
   * Subscribes to a specific topic
   * @param {Consumer} consumer - Consumer for your topic
   * @param {String} topic - Topic name
   * @param {(message: any) => void} handler - Handler for the new message
   */
  async subscribe(
    consumer: Consumer,
    topic: string,
    handler: (message: any) => void,
  ) {
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        handler(payload);
      },
    });
    this.logger.log(`Subscribed to topic: ${topic} succesfully.`);
  }
}
