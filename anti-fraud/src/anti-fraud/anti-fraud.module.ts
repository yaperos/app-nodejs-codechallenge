import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TransactionClient } from "./transaction-event/transaction.client";

@Module({
  controllers: [AntiFraudController],
  providers: [AntiFraudService, TransactionClient],
  exports: [TransactionClient],
  imports: [
    ClientsModule.register([
      {
        name: 'transaction-client',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ]
})
export class AntiFraudModule {}
