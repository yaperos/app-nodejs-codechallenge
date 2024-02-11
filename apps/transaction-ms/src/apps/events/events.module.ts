import { Module, Provider } from '@nestjs/common';
import { EventsController } from './events.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TRANSACTION_REPOSITORY } from '@transaction/src/contexts/transaction-finance/token_repository.di';
import { TransactionRepositoryImp } from '@transaction/src/contexts/transaction-finance/infrastructure/persistence/postgresql/TransactionRepositoryImp';
import { ChangeStatusCommandHandler } from '@transaction/src/contexts/transaction-finance/application/change-status/ChangeStatusCommandHandler';
import { PrismaClientModule } from '@transaction/src/contexts/shared/infrastructure/prisma-client';

const repositories: Provider[] = [
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: TransactionRepositoryImp,
  },
];

const commandHandlers: Provider[] = [ChangeStatusCommandHandler];

@Module({
  imports: [CqrsModule, PrismaClientModule],
  controllers: [EventsController],
  providers: [...repositories, ...commandHandlers],
})
export class EventsModule {}
