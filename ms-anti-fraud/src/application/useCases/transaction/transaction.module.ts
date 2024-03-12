import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig, msConfig } from '../../../infraestructure/config';
import { TransactionService } from './transaction.service';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: msConfig.nameAntiFraud,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `${msConfig.nameAntiFraud}-${msConfig.nameTransactions}`,
            brokers: [kafkaConfig.broker],
          },
          consumer: {
            groupId: `${msConfig.nameAntiFraud}-consumer`,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
