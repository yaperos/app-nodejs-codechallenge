import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateTransactionUsecase } from 'src/contexts/transactions-ms/transaction/application/create/create-transaction.usecase';
import { HealthCheckUseCase } from 'src/contexts/transactions-ms/transaction/application/health-check/health-check.usecase';
import { CreateTransactionController } from './controllers/create-transaction.controller';
import { HealthCheckController } from './controllers/health-check.controller';
import TransactionProviderRepository from 'src/contexts/transactions-ms/transaction/infraestructure/persistence/transaction-provider.repository';

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env.transactions' })],
    controllers: [HealthCheckController, CreateTransactionController],
    providers: [
        HealthCheckUseCase,
        CreateTransactionUsecase,
        TransactionProviderRepository,
    ],
})
export class AppModule {}
