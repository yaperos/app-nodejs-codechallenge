import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ValidateTransactionUseCase } from './application/update';
import { EventClientService } from './domain/services';
import { TransactionController } from './infrastructure/controller';
import { KafkaEventClientService } from './infrastructure/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD-MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    { provide: EventClientService, useClass: KafkaEventClientService },
    ValidateTransactionUseCase,
  ],
})
export class TransactionsModule {}
