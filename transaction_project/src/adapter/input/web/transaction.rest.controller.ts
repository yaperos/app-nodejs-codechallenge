import { Body, Controller, Post } from '@nestjs/common';
import { TransactionCreationUsecase } from 'src/domain/usecases/transaction_creation.usecase';
import { Transaction } from '../../../domain/models/transaction.interface';

@Controller('transaction')
export class TransactionRestController {
  constructor(
    private readonly transactionCreationUsecase: TransactionCreationUsecase,
  ) {}

  @Post()
  async create(@Body() transaction: Transaction) {
    console.log(
      '>> TX TransactionRestController: Incoming REST request: ' +
        JSON.stringify(transaction),
    );
    return this.transactionCreationUsecase.create(transaction);
  }

}
