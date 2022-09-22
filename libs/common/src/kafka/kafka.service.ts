import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [this.configService.get<string>('KAFKA_URI')],
        },
        consumer: {
          groupId: this.configService.get<string>(`KAFKA_${queue}_CONSUMER`),
        },
      },
    };
  }
}
