import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CreateTransactionUsecase } from 'src/contexts/transactions-ms/transaction/application/create/create-transaction.usecase';
import { HealthCheckUseCase } from 'src/contexts/transactions-ms/transaction/application/health-check/health-check.usecase';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import TransactionProviderRepository from 'src/contexts/transactions-ms/transaction/infraestructure/persistence/transaction-provider.repository';
import DatabaseModule from 'src/contexts/transactions-ms/shared/infraestructure/persistence/database.module';
import EventBusModule from 'src/contexts/transactions-ms/shared/infraestructure/event-bus/event-bus.module';
import { RetrieveTransactionController } from './controllers/retrieve-transaction.controller';
import { RetrieveTransactionUsecase } from 'src/contexts/transactions-ms/transaction/application/get/retrieve-transaction.usecase';
import { UpdateTransactionStatusUsecase } from 'src/contexts/transactions-ms/transaction/application/update/update-transaction-status.usecase';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env.transactions',
        }),
        DatabaseModule,
        EventBusModule,
    ],
    controllers: [
        HealthCheckController,
        CreateTransactionController,
        RetrieveTransactionController,
    ],
    providers: [
        TransactionProviderRepository,
        HealthCheckUseCase,
        CreateTransactionUsecase,
        RetrieveTransactionUsecase,
        UpdateTransactionStatusUsecase,
    ],
})
export class AppModule {}
