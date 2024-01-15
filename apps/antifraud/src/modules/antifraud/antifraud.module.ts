import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { ANTIFRAUD_KAFKA_CLIENT, TRANSACTION_KAFKA_CLIENT } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ANTIFRAUD_KAFKA_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('ANTIFRAUD_CLIENT'),
              brokers: [configService.get('BROKERS')],
            },
            consumer: {
              groupId: configService.get('ANTIFRAUD_GROUP_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: TRANSACTION_KAFKA_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('TRANSACTION_CLIENT'),
              brokers: [configService.get('BROKERS')],
            },
            consumer: {
              groupId: configService.get('TRANSACTION_GROUP_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
