import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConstants } from '../../core/domain/constants';
import { PrismaService } from '../../core/infrastructure/services';
import { RegisterTransactionUseCase } from './application/create';
import { FindOneTransactionByIdUseCase } from './application/find';
import { UpdateTransactionStatusUseCase } from './application/update';
import {
  TransactionRepository,
  TransactionTypeRepository,
} from './domain/repositories';
import { EventClientService } from './domain/services';
import { TransactionController } from './infrastructure/controllers';
import {
  PrismaTransactionRepository,
  PrismaTransactionTypeRepository,
} from './infrastructure/repositories';
import { KafkaEventClientService } from './infrastructure/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: envConstants.KAFKA_NAME_MODULE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: envConstants.KAFKA_CLIENT_ID,
            brokers: [envConstants.KAFKA_BROKER],
          },
          consumer: {
            groupId: envConstants.KAFKA_PRODUCER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    PrismaService,
    RegisterTransactionUseCase,
    UpdateTransactionStatusUseCase,
    FindOneTransactionByIdUseCase,
    { provide: TransactionRepository, useClass: PrismaTransactionRepository },
    {
      provide: TransactionTypeRepository,
      useClass: PrismaTransactionTypeRepository,
    },
    { provide: EventClientService, useClass: KafkaEventClientService },
  ],
})
export class TransactionsModule {}
