import {
  ConsoleLogger,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerRunConfig,
  ConsumerSubscribeTopic,
  Kafka,
} from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });

  private readonly consumers: Consumer[] = [];

  async consume(
    groupId: string,
    topic: ConsumerSubscribeTopic,
    config: ConsumerRunConfig,
  ) {
    const cosumer: Consumer = this.kafka.consumer({ groupId: groupId });
    await cosumer.connect().catch((e) => console.error(e));
    await cosumer.subscribe(topic);
    await cosumer.run(config);
    console.log('consumer***');
    this.consumers.push(cosumer);
  }
}
