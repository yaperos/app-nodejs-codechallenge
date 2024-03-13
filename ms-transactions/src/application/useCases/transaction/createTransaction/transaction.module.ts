import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { LoggerModule } from '../../logger/logger.module';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntiFraudModule } from '../../antiFraud/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig, msConfig } from '../../../../infraestructure/config';
import { Transactions } from '../../../../infraestructure/database/models/transactions';
import { Partitioners } from 'kafkajs';

@Module({
  providers: [TransactionService],
  controllers: [TransactionController],
  imports: [
    LoggerModule,
    AntiFraudModule,
    TypeOrmModule.forFeature([Transactions]),
    ClientsModule.register([
      {
        name: msConfig.nameTransactions,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `${msConfig.nameTransactions}-${msConfig.nameAntiFraud}`,
            brokers: [kafkaConfig.broker],
          },
          consumer: {
            groupId: `${msConfig.nameTransactions}-consumer`,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
})
export class TransactionModule {}
