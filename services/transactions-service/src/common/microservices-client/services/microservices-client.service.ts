import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class MicroservicesClientService {
  constructor(private readonly configService: ConfigService) {}
  getOptions(): ClientOptions {
    // const env = this.configService.get<string>('app.env');
    // const host = this.configService.get<string>('db.postgres.host');
    // const port = this.configService.get<number>('db.postgres.port');
    // const database = this.configService.get<string>('db.postgres.name');
    // const username = this.configService.get<string>('db.postgres.user');
    // const password = this.configService.get<string>('db.postgres.password');

    return {
      transport: Transport.KAFKA,

      options: {
        client: {
          clientId: 'transactions',
          brokers: ['localhost:9092'],
        },
      },
    };
  }
}
