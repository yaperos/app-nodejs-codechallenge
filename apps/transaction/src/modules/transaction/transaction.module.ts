import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from '../../database/database.module';
import { TransactionRepository } from './transaction.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ANTIFRAUD_KAFKA_CLIENT, TRANSACTION_KAFKA_CLIENT } from '@app/common';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [
    DatabaseModule,
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
  controllers: [TransactionController],
  providers: [TransactionResolver, TransactionService, TransactionRepository],
})
export class TransactionModule {}
