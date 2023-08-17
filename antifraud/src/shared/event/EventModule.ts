import { Global, Inject, Injectable, Module } from '@nestjs/common';
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
          name: 'MY_CLIENT_KAFKA',
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [String(configService.get<string>('KAFKA_SERVER'))],
              clientId: 'antifraud-client-producer',
            },
            // consumer: {
            //   groupId: 'micro-anti-fraud',
            // },
            producer: {
              //createPartitioner: Partitioners.DefaultPartitioner,
            },
            run: {
              autoCommit: true,
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
