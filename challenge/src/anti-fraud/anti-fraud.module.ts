/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { AntiFraudController } from './anti-fraud.controller';

@Module({
  providers: [],
  controllers: [AntiFraudController],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ANTIFRAUD_SERVICE',
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const options: KafkaOptions = {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get('KAFKA_CLIENT_ID'),
                brokers: [configService.get('KAFKA_BROKER')!],
              },
              consumer: {
                groupId: configService.get('KAFKA_GROUP_ID')!,
              },
            },
          };
          return options;
        },
      },
    ]),
  ],
})
export class AntiFraudModule {}
