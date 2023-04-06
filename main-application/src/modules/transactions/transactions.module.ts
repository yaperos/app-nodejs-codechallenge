import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ANTI_FRAUD_CONSUMER, ANTI_FRAUD_SERVICE_NAME } from 'src/app.constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigService } from '../@config/app-config.service';
import { Partitioners } from 'kafkajs';
import { TransactionsBroker } from './transactions.broker';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: ANTI_FRAUD_SERVICE_NAME,
        inject: [AppConfigService],
        useFactory: async (appConfiService: AppConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: ANTI_FRAUD_SERVICE_NAME,
                brokers: [appConfiService.getConfig.KAFKA_BROKER],
              },
              producer: {
                createPartitioner: Partitioners.DefaultPartitioner,
                allowAutoTopicCreation: true,
              },
              consumer: {
                groupId: ANTI_FRAUD_CONSUMER,
                allowAutoTopicCreation: true
              }
            }
          }
        }
      }
    ])
  ],
  controllers: [TransactionsController, TransactionsBroker],
  providers: [
    TransactionsService
  ],
  exports: [TransactionsService],
})
export class TransactionsModule { }