import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [ApplicationCoreModule],
  providers: [TransactionResolver],
})
export class UserInterfaceModule {}
