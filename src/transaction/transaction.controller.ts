import { Controller, Post } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private _service: TransactionService) {}

  @Post()
  async createtransation(transaction:CreateTransactionInput) {
    console.log('controler post');
    await this._service.createTransaction(transaction);
  }
}
