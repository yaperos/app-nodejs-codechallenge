import { Inject, Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ClientKafka} from '@nestjs/microservices';
import { KAFKA_CLIENT } from './kafka.tokens';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {    
    private readonly logger = new Logger(KafkaProducerService.name);

    constructor(
        @Inject(KAFKA_CLIENT) private readonly client: ClientKafka
    ) {}

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Kafka client connected');
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('Kafka client closed');
  }

  async emit(topic: string, payload: unknown, key?: string) {
    this.logger.log(`Try to publish message to topic ${topic} : key ${key} payload: ${JSON.stringify(payload)}`);
    const result = await firstValueFrom(this.client.emit(topic, { key, value: JSON.stringify(payload)}))
    this.logger.log(`Publish message to topic ${topic} : ${JSON.stringify(result)}`);
  }
}