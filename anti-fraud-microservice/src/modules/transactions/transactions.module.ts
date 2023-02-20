import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { ValidateTransactionUseCase } from './application/update';
import { EventClientService } from './domain/services';
import { TransactionController } from './infrastructure/controller';
import { KafkaEventClientService } from './infrastructure/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: env.KAFKA_NAME_MODULE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: env.KAFKA_CLIENT_ID,
            brokers: [env.KAFKA_BROKER],
          },
          consumer: {
            groupId: env.KAFKA_PRODUCER_GROUP_ID,
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
