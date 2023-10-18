import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TransactionMicroserviceRepository } from './transaction-microservice.repository';

@Module({
  providers: [
    TransactionResolver,
    TransactionService,
    TransactionMicroserviceRepository,
  ],
})
export class TransactionModule {}
