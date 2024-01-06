import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class MicroservicesClientService {
  constructor(private readonly configService: ConfigService) {}
  getOptions(): ClientOptions {
    const host = this.configService.get<string>('microservices.kafka.host');
    const port = this.configService.get<number>('microservices.kafka.port');
    console.log(host, port);
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'api-gateway',
          brokers: [`${host}:${port}`],
        },
      },
    };
  }
}
