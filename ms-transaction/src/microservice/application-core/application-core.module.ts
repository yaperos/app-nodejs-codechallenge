import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { TransactionRepository } from './transaction/repositories';
import { TransactionService } from './transaction/services';

const services = [TransactionRepository, TransactionService];

@Module({
  imports: [InfrastructureModule],
  providers: services,
  exports: services,
})
export class ApplicationCoreModule {}
