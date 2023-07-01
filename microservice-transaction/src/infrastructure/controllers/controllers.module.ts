import { Module } from '@nestjs/common';
import { UsecasesProxyModule } from '../usecases_proxy/usecases-proxy.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [TransactionController],
})
export class ControllersModule {}
