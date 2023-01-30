import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TransactionController]
})
export class ControllersModule {}
