import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseTypeormModule } from './shared/infraestructure/persistence/database-typeorm.module';
import { CreateTransactionController } from './transaction/infrastructure/controllers/create-transaction.controller';
import { CreateTransactionService } from './transaction/application/create-transaction.service';
import { TransactionRepository } from './transaction/domain/repositories/transaction.repository';
import { TransactionTypeormRepository } from './transaction/infrastructure/persistence/typeorm/repositories/transaction-typeorm.repository';
import { RetrieveTransactionController } from './transaction/infrastructure/controllers/retrieve-transaction.controller';
import { RetrieveTransactionService } from './transaction/application/retrieve-transaction.service';
import { EventBusModule } from './shared/infraestructure/event-bus/event-bus.module';
import { UpdateStatusTransactionController } from './transaction/infrastructure/controllers/update-status-transaction.controller';
import { UpdateStatusTransactionService } from './transaction/application/update-status.transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env-transaction',
    }),
    DatabaseTypeormModule,
    EventBusModule,
  ],
  controllers: [
    CreateTransactionController,
    RetrieveTransactionController,
    UpdateStatusTransactionController,
  ],
  providers: [
    CreateTransactionService,
    RetrieveTransactionService,
    UpdateStatusTransactionService,
    {
      provide: TransactionRepository,
      useClass: TransactionTypeormRepository,
    },
  ],
})
export class AppModule {}
