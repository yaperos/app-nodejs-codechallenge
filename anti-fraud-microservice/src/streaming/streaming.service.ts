// kafka.service.ts
import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { StreamingConfigurations } from 'src/utils/constants';

@Injectable()
export class StreamingService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(StreamingConfigurations.STREAMING_TRANSACTION_TOKEN)
    private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async onModuleDestroy() {
    await this.kafka.close();
  }

  publishEvent(topic: string, payload: any, key?: string) {
    this.kafka.emit(topic, { key, value: payload }).subscribe((val) => {
      console.log('---val', val);
    });
  }
}
