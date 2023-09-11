import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Message, RecordMetadata } from '@nestjs/microservices/external/kafka.interface';
import { lastValueFrom, timeout } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KafkaProducerService implements OnApplicationBootstrap {
  private readonly countryCode: string;
  private readonly timeZone: string;
  private readonly timeout: number;
  protected logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly clientKafka: ClientKafka, 
    private readonly configService: ConfigService
  ) {
    this.countryCode = this.configService.get<string>('global.country_code');
    this.timeZone = this.configService.get<string>('global.time_zone');
    this.timeout = Number(this.configService.get<number>('kafka.producer_send_timeout'));
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.clientKafka.connect();
    this.logger.log('Kafka Client Connected');
  }

  public async emit<T = any>(topic: string, message: T, partition?: number): Promise<boolean> {
    const payload = this.buildPayload(message);
    this.logger.log(`-> Sending message [${topic}]: ${payload.value})`);
    const result = await lastValueFrom<RecordMetadata[]>(this.clientKafka.emit(topic, payload).pipe(timeout(this.timeout)));
    return result && result.length && result.pop().errorCode === 0;
  }

  private buildPayload<T>(message: T, partition?: number) {
    const messageBuilt: Message = {
      key: uuidv4(),
      value: JSON.stringify(message),
      headers: { country: this.countryCode },
      partition
    };
    return messageBuilt;
  }
}
