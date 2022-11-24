import { NewTransactionRqDto } from "../dto/new-transaction-rq.dto/new-transaction-rq.dto";

export class CreateTransactionComand{

  transaction: NewTransactionRqDto;

  constructor(transaction: NewTransactionRqDto) {
    this.transaction = transaction;
  }

}