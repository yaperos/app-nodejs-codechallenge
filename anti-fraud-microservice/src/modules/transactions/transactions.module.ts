import { Module } from '@nestjs/common';
import { ValidateTransactionUseCase } from './application/update';
import { TransactionController } from './infrastructure/controller';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    //{ provide: EventClientService, useClass: KafkaEventClientService },
    ValidateTransactionUseCase,
  ],
})
export class TransactionsModule {}
