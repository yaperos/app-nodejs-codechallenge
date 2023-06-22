/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FinancialTransactionsResolver } from './financial-transactions.resolver';
import { FINANCIAL_TRANSACTIONS_MICROSERVICE_CONSUMER } from 'src/constans/kafka-topics';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FINANCIAL_TRANSACTIONS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'financial-transactions',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: FINANCIAL_TRANSACTIONS_MICROSERVICE_CONSUMER,
          },
        },
      },
    ]),
  ],
  providers: [FinancialTransactionsResolver]
})
export class FinancialTransactionsModule { }
