/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, KafkaOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [
    TypeOrmModule.forFeature([Transaction]),
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
export class TransactionsModule {}
