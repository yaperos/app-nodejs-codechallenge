import { Body, Controller, Post } from '@nestjs/common';
import { Transaction } from '../../../domain/models/transaction.interface';

@Controller('transaction')
export class TransactionRestController {

  @Post()
  async create(@Body() transaction: Transaction) {
    console.log(
      '>> TX TransactionRestController: Incoming REST request: ' +
        JSON.stringify(transaction),
    );
    return 'todo';
  }

}
