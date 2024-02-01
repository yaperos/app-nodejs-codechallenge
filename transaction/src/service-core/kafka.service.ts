import { Injectable, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKERS],
    });
  }

  async publish(topic: string, message: any) {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
  }

  subscribe(topic: string, callback: (message: string) => void): void {
    const consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID,
    });

    consumer
      .connect()
      .then(async () => {
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
          eachMessage: async ({ message }) => {
            try {
              const value = message.value ? message.value.toString() : '';
              this.logger.log('Nuevo mensaje recibido:', value);
              callback(value);
            } catch (error) {
              this.logger.error('Error al procesar mensaje:', error);
            }
          },
        });
      })
      .catch((error) => {
        this.logger.error('Error al conectar al consumidor de Kafka:', error);
      });
  }
}
