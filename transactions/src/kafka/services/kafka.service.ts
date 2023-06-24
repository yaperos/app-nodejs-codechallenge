import { lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async emitEvent(eventName: string, data: any): Promise<void> {
    await lastValueFrom(this.kafkaClient.emit(eventName, data));
  }
}
