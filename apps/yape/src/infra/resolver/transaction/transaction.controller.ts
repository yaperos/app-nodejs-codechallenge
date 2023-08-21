import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { SaveTransactionUseCase } from 'apps/yape/src/core/use-case/transaction/save-transaction.usecase';

@Controller()
export class TransactionController {

  constructor(private readonly saveTransactionUseCase: SaveTransactionUseCase) {}

  @EventPattern('transaction-evaluated')
  transactionEvaluated(transaction: any) {
    Logger.log(':::Transaction resolved:::');
    Logger.log(transaction);

    this.saveTransactionUseCase.update(transaction);
  }

}