import { Module } from '@nestjs/common';
import { KafkaServerController } from './adapter/controllers/kafka-server.controller';
import { TransactionApprovedHandler } from './application/event-handlers/transaction-approved.handler';
import { TransactionRejectedHandler } from './application/event-handlers/transaction-rejected.handler';
import { ValidateTransactionHandler } from './application/queries/validate-transaction.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [KafkaServerController],
  providers: [
    ValidateTransactionHandler,
    TransactionApprovedHandler,
    TransactionRejectedHandler,
  ],
})
export class AppModule {}
