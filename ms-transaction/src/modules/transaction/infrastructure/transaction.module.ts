import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from 'src/modules/shared/infrastructure/shared.module';
import { CommandHandlers } from 'src/modules/transaction/application/commands';
import { EventHandlers } from 'src/modules/transaction/application/event-handlers';
import { QueryHandlers } from 'src/modules/transaction/application/queries';
import { UseCases } from 'src/modules/transaction/application/use-cases';
import { TRANSACTION_REPOSITORY_ALIAS } from 'src/modules/transaction/domain/transaction.repository';

import { Services } from '../domain/services';
import { Controllers } from './controllers';
import { TypeOrmTransactionRepository } from './persistence/typeorm-transaction.repository';

@Module({
  imports: [CqrsModule, ConfigModule, SharedModule],
  controllers: [...Controllers],
  providers: [
    ...Services,
    ...UseCases,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: TRANSACTION_REPOSITORY_ALIAS,
      useClass: TypeOrmTransactionRepository,
    },
  ],
})
export class TransactionModule {}
