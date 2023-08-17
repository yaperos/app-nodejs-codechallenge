import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Producer } from './Producer';
import { ConfigService } from '@nestjs/config';
import { Consumer } from './Consumer';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: 'MY_CLIENT_KAFKA',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [String(configService.get<string>('KAFKA_SERVER'))],
              clientId: 'transaction-client-producer',
            },
            producer: {},
            run: {
              autoCommit: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [Producer, Consumer],
  exports: [Producer, Consumer],
})
export class EventModule {}
