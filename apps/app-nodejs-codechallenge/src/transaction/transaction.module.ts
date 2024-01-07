import { Logger, Module } from '@nestjs/common';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsResolver } from './transaction.resolver';
import { TransactionsService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
// import { LoggerModule } from '@app/shared';
import { TransactionController } from './transaction.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionStatus, Transaction, TransactionType]),
    ClientsModule.registerAsync([
      {
        name: 'ANTI_FRAUD_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const kafkaHost = configService.get<string>('KAFKA_HOST');
          const kafkaPort = configService.get<number>('KAFKA_PORT');

          Logger.debug(`${kafkaHost}:${kafkaPort}`, 'TransactionModule');

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'transaction',
                brokers: [`${kafkaHost}:${kafkaPort}`],
              },
              consumer: {
                groupId: 'anti-fraud',
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TransactionsResolver, TransactionsService],
  controllers: [TransactionController],
})
export class TransactionModule {}
