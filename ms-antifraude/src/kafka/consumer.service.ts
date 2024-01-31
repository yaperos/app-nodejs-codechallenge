import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;

  constructor() { 
    this.consumer = new Kafka({
      clientId: 'consumer-antifraude',
      brokers: ['localhost:9092'],
    }).consumer({ groupId: 'antifraude' });
  }

  async onModuleInit() {
    await this.consumer.connect();
  }


async subscribeToTopic(topic: string, handler: (event: any) => Promise<void>): Promise<void> {
  await this.consumer.subscribe({ topic, fromBeginning: true });
  await this.consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      try {
        const event = JSON.parse(payload.message.value?.toString() || '');
        await handler(event);
      } catch (error) {
        console.error(`Error al procesar el mensaje en el tópico ${topic}:`, error);
      }
    },
  });
}



  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
