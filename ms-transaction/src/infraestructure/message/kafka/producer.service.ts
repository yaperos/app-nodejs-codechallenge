import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProducer } from 'src/helper/type.helper';
import { KafkajsProducer } from './kafka.producer';
import { Message } from 'kafkajs';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    console.log('this=>', this.configService.get('KAFKA_BROKER'));
    if (!producer) {
      producer = new KafkajsProducer(topic, 'localhost:9092');
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
