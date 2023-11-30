import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialTransactionModule } from '@/transactions/financial-transactions.module';

@Module({
  imports: [FinancialTransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
