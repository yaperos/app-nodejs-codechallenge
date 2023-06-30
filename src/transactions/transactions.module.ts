import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './adapter/in/http/transactions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsService } from './use-case/transactions.service';
import { TransactionEntity } from './adapter/out/data/model/transaction.entity';
import { TransactionsProducerService } from './adapter/out/event/transactions.producer.service';
import { TransactionApprovedConsumerService } from './adapter/in/event/transaction.approved.consumer.service';
import { TransactionRejectedConsumerService } from './adapter/in/event/transaction.rejected.consumer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    ClientsModule.register([
        {
            name: 'TRANSACTION_MICROSERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'transaction',
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'transaction-consumer',
              },
            },
        },
    ])
  ],
    controllers: [TransactionsController, TransactionApprovedConsumerService, TransactionRejectedConsumerService],
    providers: [TransactionsService, TransactionsProducerService, TransactionApprovedConsumerService, TransactionRejectedConsumerService]
})
export class TransactionsModule {}
