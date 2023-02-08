import { Module, OnModuleInit } from '@nestjs/common';
import { DataService } from './core/infrastructure/services';
import { TransactionsModule } from './modules/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    DataService.insertInitialData();
  }
}
