import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('ANTIFRAUD_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}
  async verification(id: string, value: number) {
    const dataVerified = {
      id,
      status: value > 1000 ? 0 : 1,
    };
    await lastValueFrom(this.kafkaClient.emit('antifraud', dataVerified));
  }
}
